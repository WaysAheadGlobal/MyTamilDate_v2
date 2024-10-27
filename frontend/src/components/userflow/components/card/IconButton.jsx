import React from 'react'
import heartIcon from '../../../../assets/images/heartIcon.png';

const Icons = {
    undo: <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25.2267" cy="25.2267" r="24.596" transform="matrix(-1 0 0 1 50.9219 0.09375)" fill="#4B164C" stroke="#DDCAED" stroke-width="1.26133" />
        <g clip-path="url(#clip0_969_22038)">
            <path d="M33.8701 24.1495H20.0188L24.2583 19.0574C24.4565 18.8189 24.5519 18.5115 24.5234 18.2026C24.4949 17.8938 24.3449 17.6089 24.1064 17.4107C23.8679 17.2125 23.5604 17.1171 23.2516 17.1456C22.9428 17.174 22.6579 17.324 22.4597 17.5625L16.6202 24.5699C16.5809 24.6257 16.5458 24.6842 16.5151 24.7451C16.5151 24.8035 16.5151 24.8386 16.4333 24.897C16.3804 25.0309 16.3527 25.1734 16.3516 25.3174C16.3527 25.4614 16.3804 25.6039 16.4333 25.7378C16.4333 25.7962 16.4333 25.8313 16.5151 25.8897C16.5458 25.9506 16.5809 26.0091 16.6202 26.0649L22.4597 33.0723C22.5695 33.2041 22.707 33.3101 22.8624 33.3828C23.0179 33.4555 23.1874 33.493 23.359 33.4927C23.6319 33.4932 23.8963 33.3982 24.1064 33.2241C24.2247 33.126 24.3224 33.0056 24.3941 32.8697C24.4657 32.7339 24.5099 32.5852 24.524 32.4322C24.5381 32.2793 24.5219 32.125 24.4763 31.9783C24.4307 31.8316 24.3566 31.6954 24.2583 31.5773L20.0188 26.4853H33.8701C34.1798 26.4853 34.4769 26.3623 34.6959 26.1432C34.9149 25.9242 35.038 25.6271 35.038 25.3174C35.038 25.0076 34.9149 24.7106 34.6959 24.4916C34.4769 24.2725 34.1798 24.1495 33.8701 24.1495Z" fill="white" />
        </g>
        <defs>
            <clipPath id="clip0_969_22038">
                <rect width="28.0296" height="28.0296" fill="white" transform="translate(11.6797 11.3047)" />
            </clipPath>
        </defs>
    </svg>,
    like: <svg width="89" height="89" viewBox="0 0 89 89" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_4837_11711)">
    <circle cx="44.5" cy="40.5" r="40.5" fill="url(#paint0_linear_4837_11711)"/>
    </g>
    <path d="M23.1855 33.1887C23.1855 21.5705 39.4858 17.2646 44.5013 30.7143C49.5169 17.2646 65.8171 21.5705 65.8171 33.1887C65.8171 45.8118 44.5013 61.8164 44.5013 61.8164C44.5013 61.8164 23.1855 45.8118 23.1855 33.1887Z" fill="white"/>
    <defs>
    <filter id="filter0_d_4837_11711" x="0" y="0" width="89" height="89" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="4"/>
    <feGaussianBlur stdDeviation="2"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4837_11711"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4837_11711" result="shape"/>
    </filter>
    <linearGradient id="paint0_linear_4837_11711" x1="44.5" y1="0" x2="44.5" y2="81" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FC8C66"/>
    <stop offset="1" stop-color="#F76A7B"/>
    </linearGradient>
    </defs>
    </svg>
      ,
    // like :  <svg width="84" height="83" viewBox="0 0 84 83" fill="none" xmlns="http://www.w3.org/2000/svg">
    // <g filter="url(#filter0_d_4810_11613)">
    // <g filter="url(#filter1_d_4810_11613)">
    // <ellipse cx="37.3076" cy="37.3086" rx="37.3076" ry="37.3086" fill="url(#paint0_linear_4810_11613)"/>
    // <path d="M74.3652 37.3086C74.3652 57.7755 57.774 74.3672 37.3076 74.3672C16.8413 74.3672 0.25 57.7755 0.25 37.3086C0.25 16.8417 16.8413 0.25 37.3076 0.25C57.774 0.25 74.3652 16.8417 74.3652 37.3086Z" stroke="black" stroke-width="0.5"/>
    // </g>
    // <g clip-path="url(#clip0_4810_11613)">
    // <mask id="mask0_4810_11613" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="15" y="18" width="44" height="44">
    // <path d="M15.7832 18.6547H58.8305V61.7031H15.7832V18.6547Z" fill="white"/>
    // </mask>
    // <g mask="url(#mask0_4810_11613)">
    // <path d="M19.2578 32.6144C19.2578 22.6465 33.0605 18.9522 37.3075 30.4915C41.5546 18.9522 55.3573 22.6465 55.3573 32.6144C55.3573 43.4445 37.3075 57.1758 37.3075 57.1758C37.3075 57.1758 19.2578 43.4445 19.2578 32.6144Z" fill="white"/>
    // </g>
    // </g>
    // </g>
    // <defs>
    // <filter id="filter0_d_4810_11613" x="0" y="0" width="82.6152" height="82.6172" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    // <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    // <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    // <feOffset dx="4" dy="4"/>
    // <feGaussianBlur stdDeviation="2"/>
    // <feComposite in2="hardAlpha" operator="out"/>
    // <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.75 0"/>
    // <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4810_11613"/>
    // <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4810_11613" result="shape"/>
    // </filter>
    // <filter id="filter1_d_4810_11613" x="0" y="0" width="83.6152" height="82.6172" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    // <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    // <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    // <feOffset dx="5" dy="4"/>
    // <feGaussianBlur stdDeviation="2"/>
    // <feComposite in2="hardAlpha" operator="out"/>
    // <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
    // <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4810_11613"/>
    // <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4810_11613" result="shape"/>
    // </filter>
    // <linearGradient id="paint0_linear_4810_11613" x1="37.3076" y1="0" x2="37.3076" y2="74.6172" gradientUnits="userSpaceOnUse">
    // <stop stop-color="#FC8C66"/>
    // <stop offset="1" stop-color="#F76A7B"/>
    // </linearGradient>
    // <clipPath id="clip0_4810_11613">
    // <rect width="43.0473" height="43.0484" fill="white" transform="translate(15.7832 18.6562)"/>
    // </clipPath>
    // </defs>
    // </svg>
// ,    
    skip:<svg width="56" height="60" viewBox="0 0 56 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_4837_11716)">
    <circle cx="26" cy="26" r="26" fill="#F7ECFF"/>
    </g>
    <g clip-path="url(#clip0_4837_11716)">
    <path d="M33.7692 20.6133L19 35.3825M19 20.6133L33.7692 35.3825" stroke="#CCCCCC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M33.7692 20.6133L19 35.3825M19 20.6133L33.7692 35.3825" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M33.7692 20.6133L19 35.3825M19 20.6133L33.7692 35.3825" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M33.7692 20.6133L19 35.3825M19 20.6133L33.7692 35.3825" stroke="#664778" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
    <filter id="filter0_d_4837_11716" x="-4" y="0" width="60" height="60" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="4"/>
    <feGaussianBlur stdDeviation="2"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4837_11716"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4837_11716" result="shape"/>
    </filter>
    <clipPath id="clip0_4837_11716">
    <rect width="17.2308" height="17.2308" fill="white" transform="translate(17 19.3867)"/>
    </clipPath>
    </defs>
    </svg>
    
    
    
    ,
    chat: <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_4850_11581)">
    <circle cx="30" cy="26" r="26" fill="#664778"/>
    </g>
    <path d="M39.1589 16.8267C37.032 14.6858 34.2248 13.3542 31.2212 13.0612C28.2177 12.7683 25.2061 13.5325 22.7056 15.222C20.205 16.9115 18.3724 19.4206 17.5235 22.3165C16.6745 25.2124 16.8626 28.3138 18.0552 31.0859C18.1795 31.3436 18.2203 31.6336 18.1719 31.9156L17.0312 37.3989C16.9872 37.6091 16.9962 37.827 17.0573 38.0329C17.1184 38.2388 17.2297 38.4263 17.3812 38.5785C17.5054 38.7018 17.6532 38.7987 17.8159 38.8633C17.9785 38.9279 18.1525 38.9589 18.3275 38.9544H18.5867L24.1349 37.8396C24.4169 37.8057 24.7028 37.8459 24.9645 37.9563C27.7366 39.1489 30.838 39.337 33.7339 38.4881C36.6299 37.6392 39.1389 35.8065 40.8284 33.306C42.5179 30.8055 43.2821 27.7938 42.9892 24.7903C42.6963 21.7868 41.3646 18.9795 39.2238 16.8526L39.1589 16.8267ZM40.2349 27.6637C39.9814 29.2115 39.3802 30.6816 38.4765 31.9634C37.5728 33.2452 36.3901 34.3054 35.0175 35.0641C33.6448 35.8228 32.118 36.2602 30.5518 36.3436C28.9857 36.4269 27.421 36.1539 25.9756 35.5452C25.463 35.3271 24.9123 35.2126 24.3552 35.2081C24.1119 35.2098 23.8691 35.2315 23.6293 35.273L19.9738 36.0118L20.7126 32.3563C20.8598 31.5646 20.7649 30.747 20.4404 30.01C19.8317 28.5646 19.5587 26.9999 19.642 25.4338C19.7254 23.8676 20.1628 22.3408 20.9215 20.9681C21.6802 19.5955 22.7404 18.4128 24.0222 17.5091C25.304 16.6054 26.7742 16.0042 28.3219 15.7507C29.9465 15.4841 31.6113 15.6081 33.1785 16.1125C34.7456 16.6169 36.1702 17.4871 37.3344 18.6512C38.4985 19.8154 39.3688 21.24 39.8731 22.8072C40.3775 24.3743 40.5015 26.0391 40.2349 27.6637Z" fill="white"/>
    <defs>
    <filter id="filter0_d_4850_11581" x="0" y="0" width="60" height="60" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="4"/>
    <feGaussianBlur stdDeviation="2"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4850_11581"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4850_11581" result="shape"/>
    </filter>
    </defs>
    </svg>
    ,
    likeActive: <svg width="89" height="89" viewBox="0 0 89 89" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_4850_11571)">
    <circle cx="44.5" cy="40.5" r="40.5" fill="url(#paint0_linear_4850_11571)"/>
    </g>
    <path d="M23.1855 33.1887C23.1855 21.5705 39.4858 17.2646 44.5013 30.7143C49.5169 17.2646 65.8171 21.5705 65.8171 33.1887C65.8171 45.8118 44.5013 61.8164 44.5013 61.8164C44.5013 61.8164 23.1855 45.8118 23.1855 33.1887Z" fill="white"/>
    <defs>
    <filter id="filter0_d_4850_11571" x="0" y="0" width="89" height="89" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="4"/>
    <feGaussianBlur stdDeviation="2"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4850_11571"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4850_11571" result="shape"/>
    </filter>
    <linearGradient id="paint0_linear_4850_11571" x1="44.5" y1="0" x2="44.5" y2="81" gradientUnits="userSpaceOnUse">
    <stop stop-color="#FC8C66"/>
    <stop offset="1" stop-color="#F76A7B"/>
    </linearGradient>
    </defs>
    </svg>
    ,
    details: <div style={{
        position: "relative",
        width: "fit-content",
    }}>
        <svg width="79" height="74" viewBox="0 0 79 74" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_dddd_3448_10075)">
                <circle cx="39.2588" cy="31.2588" r="29.2588" fill="url(#paint0_linear_3448_10075)" />
            </g>
            <defs>
                <filter id="filter0_dddd_3448_10075" x="0.247071" y="0.0494142" width="78.0215" height="95.5768" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="1.95059" />
                    <feGaussianBlur stdDeviation="1.95059" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.388235 0 0 0 0 0.388235 0 0 0 0 0.388235 0 0 0 0.1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3448_10075" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="5.85176" />
                    <feGaussianBlur stdDeviation="2.92588" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.388235 0 0 0 0 0.388235 0 0 0 0 0.388235 0 0 0 0.09 0" />
                    <feBlend mode="normal" in2="effect1_dropShadow_3448_10075" result="effect2_dropShadow_3448_10075" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="13.6541" />
                    <feGaussianBlur stdDeviation="3.90117" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.388235 0 0 0 0 0.388235 0 0 0 0 0.388235 0 0 0 0.05 0" />
                    <feBlend mode="normal" in2="effect2_dropShadow_3448_10075" result="effect3_dropShadow_3448_10075" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="25.3576" />
                    <feGaussianBlur stdDeviation="4.87646" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0.388235 0 0 0 0 0.388235 0 0 0 0 0.388235 0 0 0 0.01 0" />
                    <feBlend mode="normal" in2="effect3_dropShadow_3448_10075" result="effect4_dropShadow_3448_10075" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_3448_10075" result="shape" />
                </filter>
                <linearGradient id="paint0_linear_3448_10075" x1="10" y1="31.2588" x2="68.5176" y2="31.2588" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FC8C66" />
                    <stop offset="1" stop-color="#F76A7B" />
                </linearGradient>
            </defs>
        </svg>
        <svg style={{
            position: "absolute",
            top: "0.8rem",
            left: "1.25rem"
        }} width="39" height="37" viewBox="0 0 39 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.12152 9.00583C9.33883 9.00583 9.55269 9.08861 9.70791 9.25418L18.9487 18.8539L28.1895 9.25419C28.4896 8.94292 28.9967 8.92305 29.3209 9.21114C29.6452 9.49923 29.6659 9.986 29.3658 10.2973L19.5351 20.5063C19.2316 20.8208 18.6624 20.8208 18.3589 20.5063L8.53168 10.294C8.23159 9.98269 8.25229 9.49591 8.57653 9.20782C8.73175 9.07206 8.92836 9.00583 9.12152 9.00583Z" fill="white" />
            <path d="M9.12152 18.4668C9.33883 18.4668 9.55269 18.5496 9.70791 18.7151L18.9487 28.3115L28.1895 18.7118C28.4896 18.4005 28.9967 18.3807 29.3209 18.6688C29.6452 18.9569 29.6659 19.4436 29.3658 19.7549L19.5351 29.9672C19.2316 30.2818 18.6624 30.2818 18.3589 29.9672L8.53168 19.7549C8.23159 19.4436 8.25229 18.9569 8.57653 18.6688C8.73175 18.533 8.92836 18.4668 9.12152 18.4668Z" fill="white" />
        </svg>
    </div>
}

export default function IconButton({ type, onClick }) {
    return (
        <button
            style={{
                width: "fit-content",
                borderRadius: "9999px",
                border: "none",
                backgroundColor: "transparent",
            }}
            onClick={onClick}
        >
            {Icons[type]}
        </button>
    )
}
