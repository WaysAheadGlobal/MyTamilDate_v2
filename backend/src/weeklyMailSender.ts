import { RowDataPacket } from "mysql2";
import { db } from "../db/db";
import MailService from "../mail";
import cron from 'node-cron';
import UserApprovalEnum from "./enums/UserApprovalEnum";
const mailService = new MailService();

export async function sendWeeklyMail(userId: number, email: string, gender: number, want_gender: number) {
    const getImageURL = (type: number, hash: string, extension: string, userId: string) => type === 1 ? `https://data.mytamildate.com/storage/public/uploads/user/${userId}/avatar/${hash}-large.${extension}` : `${process.env.API_URL}media/avatar/${hash}.${extension}`;

    try {
        const query = `
            SELECT
                up.user_id,
                CONCAT(up.first_name, ' ', up.last_name) AS name,
                m.type,
                m.hash,
                m.extension
            FROM 
                user_profiles up
            INNER JOIN media m ON up.user_id = m.user_id 
            INNER JOIN users u ON u.id = up.user_id AND u.approval = ${UserApprovalEnum.APPROVED}
            WHERE 
                m.type IN (1, 31) AND m.hash IS NOT NULL
                AND up.user_id != ?
                AND up.gender = ?
                AND up.want_gender = ?
                AND up.created_at >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)
                AND u.active = 1
                AND u.deleted_at IS NULL
            ORDER BY 
                up.created_at DESC
            LIMIT 3;
        `;
        const [profiles] = await db.promise().query<RowDataPacket[]>(query, [userId, want_gender, gender]);

        if (profiles.length === 0) {
            return;
        }

        const data = profiles.map(profile => ({
            name: profile.name,
            image: getImageURL(profile.type, profile.hash, profile.extension, profile.user_id),
            link: `${process.env.URL}/user/${profile.name}/${profile.user_id}`
        }));

        await mailService.sendWeeklyMail(email, data);
    } catch (err) {
        console.log('Error sending weekly mail:', err);
    }
}

// Function to fetch new likes received in the past week
async function fetchNewLikes(userId: number) {
    try {
        const query = `
             SELECT 
            up.user_id,
            up.first_name, 
            up.last_name,
            l.country,
            j.name as job,
            me.hash,
            me.type,
            me.extension
        FROM matches m
            INNER JOIN user_profiles up ON m.user_id = up.user_id
            INNER JOIN locations l ON l.id = up.location_id
            INNER JOIN jobs j ON j.id = up.job_id
            INNER JOIN media me ON me.user_id = up.user_id
        WHERE m.\`like\` = 1 AND m.skip = 0 AND me.type IN (1, 31) AND m.person_id = ?
         ORDER BY 
                up.created_at DESC
            LIMIT 3;
        `;

        const [likes] = await db.promise().query<RowDataPacket[]>(query, [userId]);

        return likes;
    } catch (err) {
        console.log('Error fetching new likes:', err);
        return [];
    }
}

// Function to send weekly email about new likes
export async function sendWeeklyLikesMail(userId: number, email: string) {
    console.log("like mail called")
    const getImageURL = (type: number, hash: string, extension: string, userId: string) => type === 1 ? `https://data.mytamildate.com/storage/public/uploads/user/${userId}/avatar/${hash}-large.${extension}` : `${process.env.API_URL}media/avatar/${hash}.${extension}`;

    try {
        const newLikes = await fetchNewLikes(userId);
         console.log(newLikes)
        if (newLikes.length === 0) {
            return;
        }

        const data = newLikes.map(like => ({
            name: like.first_name,
            image: getImageURL(like.type, like.hash, like.extension, like.user_id),
            link: `${process.env.URL}/user/${like.first_name}/${like.user_id}`
        }));
      console.log(data);
        await mailService.sendWeeklyLikesMail(email, data);
        console.log("like mail send successfully")
    } catch (err) {
        console.log('Error sending weekly likes mail:', err);
    }
}

// Function to send weekly email about new messages
export async function sendWeeklyMessagesMail(userId: number, email: string) {
    console.log("message mail called");
    const getImageURL = (type: number, hash: string, extension: string, userId: string) => type === 1 ? `https://data.mytamildate.com/storage/public/uploads/user/${userId}/avatar/${hash}-large.${extension}` : `${process.env.API_URL}media/avatar/${hash}.${extension}`;
    try {
        const newMessages = await fetchNewMessages(userId);
        console.log(newMessages);

        if (newMessages.length === 0) {
            return;
        }

        const data : any = newMessages.map(message => ({
            name: `${message.first_name}`,
            messagePreview: message.message,
            image : getImageURL(newMessages[0].type, newMessages[0].hash, newMessages[0].extension, newMessages[0].user_id),
            link: `${process.env.URL}/user/chat`
        }));

        console.log(data);

        await mailService.sendWeeklyMessagesMail(email, data);
        console.log("message mail sent successfully");
    } catch (err) {
        console.log('Error sending weekly messages mail:', err);
    }
}

// Function to fetch new messages from the last week
async function fetchNewMessages(userId: number) {
    const query = `
        WITH conversations AS (
            SELECT
                up.user_id,
                up.first_name,
                up.last_name,
                m.hash,
                m.type,
                m.extension,
                (
                    SELECT 
                        dp2.participant_id 
                    FROM 
                        dncm_participants dp2 
                    WHERE 
                        dp2.conversation_id = dp.conversation_id 
                        AND dp2.participant_id != ?
                ) AS participant_id,
                (
                    SELECT 
                        dm.body 
                    FROM 
                        dncm_messages dm 
                    WHERE 
                        dm.conversation_id = dp.conversation_id
                        AND dm.body IS NOT NULL  
                        ORDER BY dm.sent_at DESC 
                        LIMIT 1
                ) AS message,
                (
                    SELECT 
                        dm.sent_at 
                    FROM 
                        dncm_messages dm 
                    WHERE 
                        dm.conversation_id = dp.conversation_id 
                        AND dm.body IS NOT NULL 
                        ORDER BY dm.sent_at DESC 
                        LIMIT 1
                ) AS sent_at,
                dp.conversation_id 
            FROM 
                dncm_participants dp
                INNER JOIN user_profiles up ON up.user_id IN (
                    SELECT 
                        dp2.participant_id 
                    FROM 
                        dncm_participants dp2 
                    WHERE dp2.conversation_id = dp.conversation_id 
                        AND dp2.participant_id != ?
                )
                INNER JOIN media m ON m.user_id = up.user_id
            WHERE 
                dp.participant_id = ?
                AND m.type IN (1, 31) 
                AND up.user_id NOT IN (
                    SELECT b.person_id
                    FROM blocks b
                    WHERE b.user_id = dp.participant_id
                ) 
                AND up.user_id NOT IN (
                    SELECT ma.person_id
                    FROM user_unmatches um 
                    INNER JOIN matches ma ON ma.id = um.match_id 
                    WHERE um.user_id = dp.participant_id
                ) 
                AND up.user_id NOT IN (
                    SELECT r.person_id
                    FROM reports r
                    WHERE r.user_id = dp.participant_id
                )
        )
        SELECT 
            user_id, 
            first_name,
            last_name,
            hash,
            type,
            extension,
            participant_id,
            sent_at,
            IF (LENGTH(message) > 50, CONCAT(SUBSTR(message, 1, 50), '...'), message) AS message,
            conversation_id
        FROM 
            conversations 
        WHERE 
            message IS NOT NULL 
       
        ORDER BY 
            sent_at DESC;
    `;

    try {
        const [results] = await db.promise().query<RowDataPacket[]>(query, [userId, userId, userId]);
        console.log(results)
        return results;
    } catch (err) {
        console.log('Error fetching new messages:', err);
        return [];
    }
}

export const fetchPremiumActiveUsers = async () => {
    try {
        const query = `
        SELECT
            u.id,
            up.gender,
            up.want_gender,
            up.email
        FROM 
            users u
            INNER JOIN user_profiles up ON u.id = up.user_id
            INNER JOIN subscriptions s ON u.id = s.user_id
        WHERE
            u.approval = ${UserApprovalEnum.APPROVED}
            AND u.active = 1
            AND u.deleted_at IS NULL
            AND s.stripe_status = 'active';  -- Checks for active premium subscription
        `;

        const [users] = await db.promise().query<RowDataPacket[]>(query);
        return users;
    } catch (err) {
        console.log('Error fetching premium active users:', err);
        return [];
    }
};

export const fetchNonPremiumActiveUsers = async () => {
    try {
        const query = `
        SELECT
            u.id,
            up.gender,
            up.want_gender,
            up.email
        FROM 
            users u
            INNER JOIN user_profiles up ON u.id = up.user_id
        WHERE
            u.approval = ${UserApprovalEnum.APPROVED}
            AND u.active = 1
            AND u.deleted_at IS NULL
            AND u.id NOT IN (SELECT user_id FROM subscriptions WHERE stripe_status = 'active');  -- Filters out premium users
        `;

        const [users] = await db.promise().query<RowDataPacket[]>(query);
        return users;
    } catch (err) {
        console.log('Error fetching non-premium active users:', err);
        return [];
    }
};

// async function fetchActiveUsers() {
//     try {
//         const query = `
//         SELECT
//             u.id,
//             up.gender,
//             up.want_gender,
//             up.email
//         FROM 
//             users u
//             INNER JOIN user_profiles up ON u.id = up.user_id
//         WHERE
//             u.approval = ${UserApprovalEnum.APPROVED}
//             AND u.active = 1
//             AND u.deleted_at IS NULL;
//         `;

//         const [users] = await db.promise().query<RowDataPacket[]>(query);

//         return users;
//     } catch (err) {
//         console.log('Error fetching active users:', err);
//     }
// }

// Send weekly mail first Monday at 12:00 AM of every Month
cron.schedule('0 0 * * 3', async () => {
    /* const users = await fetchNonPremiumActiveUsers(); */
    const today = new Date();
    const dayOfMonth = today.getDate();
    const dayOfWeek = today.getDay();
    if (dayOfWeek === 1 && dayOfMonth <= 7) {
    const users = [
        {
            id: 73661,
            gender: 1,
            want_gender: 2,
            email: 'vedican.v44@gmail.com',
        }
    ];

    if (!users) {
        return;
    }

    for (const user of users) {
        await sendWeeklyMail(user.id, user.email, user.gender, user.want_gender);
    }
}
});

// Cron expression for every Wednesday at midnight new like recived
cron.schedule('0 0 * * 3', async () => { 
    // const users = await fetchPremiumActiveUsers();
    const users = [
        {
            id: 73707,
            email: 'vedican.v44@gmail.com',
        },
      
    ];


    if (!users) {
        return;
    }

    for (const user of users) {
        await sendWeeklyLikesMail(user.id, user.email);
    }
});


cron.schedule('0 0 * * 0', async () => { 
    // const users = await fetchPremiumActiveUsers();
    const users = [
        {
            id: 73707,
            email: 'vedican.v44@gmail.com',
        },
      
    ];


    if (!users) {
        return;
    }

    for (const user of users) {
        await sendWeeklyMessagesMail(user.id, user.email);
    }
});




// * * * * * 
// | | | | |
// | | | | └── Day of the week (0 - 7) (Sunday = 0 or 7)
// | | | └──── Month (1 - 12)
// | | └────── Day of the month (1 - 31)
// | └──────── Hour (0 - 23)
// └────────── Minute (0 - 59)
