import { MenuItem, Select } from '@mui/material';
import Slider from '@mui/material/Slider';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { API_URL } from '../../../../api';
import { useCookies } from '../../../../hooks/useCookies';
import Button from "../../components/button/Button";
import Sidebar from '../../components/sidebar/sidebar';
import styles from './preferences.module.css';
import './slider.css';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../components/context/UserProfileContext';
import UpgradeModal from '../../components/upgradenow/upgradenow';
import { ModalBody } from 'react-bootstrap';

const Forms = {
     Radio : ({ options, value, setValue, firstOption, selected }) => {
        const [currentValue, setCurrentValue] = useState(value || selected || firstOption?.value || null);
    
        useEffect(() => {
            // Set initial value from 'selected' when the modal opens
            if (selected) {
                setCurrentValue(selected);
            }
        }, [selected]);
    
        const handleChange = (optionValue) => {
            setCurrentValue(optionValue); // Update the local state
            setValue(optionValue); // Update the parent state
        };
    
        return (
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem"
            }}>
                {
                    firstOption && (
                        <label htmlFor={firstOption.label} className={styles.inputRadio}>
                            <input
                                id={firstOption.label}
                                name="radio-input"
                                value={firstOption.value}
                                checked={currentValue === firstOption.value || currentValue === "any"}
                                onChange={() => handleChange(firstOption.value)}
                                type="radio"
                            />
                            <p>{firstOption.label}</p>
                        </label>
                    )
                }
                {Array.isArray(options) && options.map((option, index) => (
                    <label key={index} htmlFor={option.name} className={styles.inputRadio}>
                        <input
                            id={option.name}
                            name="radio-input"
                            value={option.id !== null ? option.id : 'null'}
                            checked={option.id === null ? currentValue === null : currentValue === option.id || currentValue === option.name}
                            onChange={() => handleChange(option.id)}
                            type="radio"
                        />
                        <p>{option.name}</p>
                    </label>
                ))}
            </div>
        );
    }
    ,
    Range: ({ value, setValue, age_from, age_to }) => {
        console.log(value)
        return (
            <>
                <p style={{
                    fontSize: "large",
                    fontWeight: "500",
                    marginTop: "-1rem"
                }}>{value?.[0] ?? age_from} - {value?.[1] ?? age_to}</p>
                <Slider
                    value={Array.isArray(value) ? value : [age_from ?? 20, age_to ?? 27]}
                    onChange={(e, newValue) => setValue(newValue)}
                    valueLabelDisplay="auto"
                    disableSwap
                    min={18}
                />
            </>
        )
    },
    Location: ({ options, value, setValue, locationId }) => {
        const [selectedCountry, setSelectedCountry] = useState("");
        const [selectedCity, setSelectedCity] = useState("");
        const [countrySelectCollasped, setCountrySelectCollasped] = useState(true);

        useEffect(() => {
            if (!locationId) return;
            console.log(locationId);
            const val = Object.keys(options).map(option => options[option]).flat().find(option => option.id === locationId);
            setSelectedCountry(val?.country);
            setSelectedCity(val?.id);
            setCountrySelectCollasped(false);
        }, [options]);

        useEffect(() => {
            setValue(selectedCity);
        }, [selectedCity]);

        // Automatically select the first city when a country is selected
        useEffect(() => {
            if (selectedCountry && options[selectedCountry] && options[selectedCountry].length > 0 && !selectedCity) {
                setSelectedCity(options[selectedCountry][0].id);  // Automatically set the first city
            }
        }, [selectedCountry]);

        useEffect(() => {
            if (!countrySelectCollasped) {
                setValue(null);
            }
        }, [countrySelectCollasped]);

        return (
            <>
                <label htmlFor="country" className={styles.locationRadio}>
                    <p>Select Country</p>
                    <input type="radio" id="country" name="country-option" checked={!countrySelectCollasped} onClick={() => setCountrySelectCollasped(false)} />
                </label>
                <label htmlFor="any" className={styles.locationRadio}>
                    <p>Any</p>
                    <input type="radio" id="any" name="country-option" value="any" checked={countrySelectCollasped} onClick={() => setCountrySelectCollasped(true)} />
                </label>
                {!countrySelectCollasped && (
                    <>
                        <p style={{
                            textAlign: "start",
                            fontSize: "large",
                            fontWeight: "500",
                        }}>Search nearby people</p>
                        <Select
                            style={{
                                width: "100%",
                                textAlign: "start"
                            }}
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            displayEmpty
                            placeholder='Select a country'
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        width: "9rem",
                                        height: "12rem"
                                    }
                                }
                            }}
                        >
                            <MenuItem value="" disabled>Select a country</MenuItem>
                            {
                                Object.keys(options)?.map((option, index) => (
                                    <MenuItem
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </MenuItem>
                                ))
                            }
                        </Select>

                        <Select
                            style={{
                                width: "100%",
                                textAlign: "start"
                            }}
                            value={selectedCity}
                            displayEmpty
                            onChange={(e) => setSelectedCity(e.target.value)}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        width: "9rem",
                                        height: "12rem"
                                    },
                                }
                            }}
                        >
                            <MenuItem value="" disabled>Select a city</MenuItem>
                            {
                                options[selectedCountry]?.map((option, index) => (
                                    <MenuItem
                                        key={option.id}
                                        value={option.id}
                                    >
                                        {option.location_string}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </>
                )}
            </>
        )
    },

    Select: ({ options, value, setValue, firstOption, selected }) => {
        const [selectedOption, setSelectedOption] = useState("Select a option");
        const [open, setOpen] = useState(false);

        useEffect(() => {
            if (!selected) {
                setSelectedOption("any");
            } else {
                setSelectedOption(options.find(option => option.name === selected)?.id);
            }

        }, [selected])

        useEffect(() => {
            setValue(selectedOption);
        }, [selectedOption])

        return (
            <div className={styles["select-container"]} data-open={open}>
                <div className={styles["select-display"]} onClick={() => {
                    setOpen(!open);
                }} data-value={selectedOption === "any" ? "Open to all" : options.find(option => option.id === selectedOption)?.name}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                    </svg>
                </div>
                <ul className={styles["select-options"]}>
                    <li
                        style={{
                            textAlign: "start",
                        }}
                        className={selectedOption === "any" ? styles["selected"] : ""}
                        onClick={() => setSelectedOption("any")}
                    >Open to all</li>
                    {
                        options?.map((option, index) => (
                            <li
                                key={index}
                                style={{
                                    textAlign: "start",
                                }}
                                className={selectedOption === option.id ? styles["selected"] : ""}
                                onClick={() => setSelectedOption(option.id)}
                            >{option.name}</li>
                        ))
                    }
                </ul>
                <div className={styles["select-backdrop"]} onClick={() => setOpen(false)}></div>
            </div>
        )
    }
}

export default function Preferences() {
    /**
     * @typedef {Object} SelectedPreference
     * @property {string} title
     * @property {'select' | 'range' | 'radio' | 'location'} type
     * @property {'gender' | 'age' | 'religion' | 'location' | 'education' | 'smoke' | 'drink' | 'children' | 'family'} element
     * @property {string} optionsApiEndpoint
     * @property {string} saveApiEndpoint
     */

    /** @type {[SelectedPreference, React.Dispatch<React.SetStateAction<SelectedPreference>>]} */
    const [selectedPreference, setSelectedPreference] = useState({});
    const [selectedPreferenceOptions, setSelectedPreferenceOptions] = useState([]);
    const [show, setShow] = useState(false);
    const [locationshow, setLocationshow] = useState(false)
    const [value, setValue] = useState();
    const cookies = useCookies();
    const { setRefresh } = useUserProfile();
    const [filteredOptions, setFilteredOptions] = useState([]);


    useEffect(() => {
        if (selectedPreference.element !== "location") {
            console.log(selectedPreference.element)
            if (selectedPreference.element === "gender") {
                  let options = [...selectedPreferenceOptions];
                  console.log(options);
                    // Add the "Open to all" option
                    options.push({ name: 'Everyone', id: null });
                    console.log(options);
                const filteroptions = options.filter(option => option.name !== 'Other');
                     console.log(filteroptions);
                setFilteredOptions(filteroptions);
              
            }
            else {
                if (selectedPreference.element === "children" || selectedPreference.element === "family") {
                    console.log("donee");

                    // Create a copy of the options array
                    let options = [...selectedPreferenceOptions];

                    // Add the "Open to all" option
                    options.push({ name: 'Open to all', id: null });

                    // Filter out the "Prefer not to say" option
                    const filteredOptions = options.filter(option => option.name !== 'Prefer not to say');

                    // Update the state with the filtered options
                    setFilteredOptions(filteredOptions);

                    console.log(filteredOptions);
                }
               
                else {
                    if(selectedPreference.element === "religion" ){
                        let options = [...selectedPreferenceOptions];
                        console.log(options);
                          // Add the "Open to all" option
                         
                      const filteroptions = options.filter(option => 
                        option.name !== 'Prefer not to say' &&   option.name !== 'Other');
                           console.log(filteroptions);
                      setFilteredOptions(filteroptions);
                    }
                    else{

                        const options = selectedPreferenceOptions.filter(option => option.name !== 'Prefer not to say');
                        setFilteredOptions(options);
                        console.log(options);
                    }

                 
                }
            }




        }

    }, [selectedPreferenceOptions]);

    /**
     * @typedef {Object} Preferences
     * @property {Number} age_from
     * @property {Number} age_to
     * @property {string} drinking
     * @property {string} education
     * @property {string} gender
     * @property {string} have_kids
     * @property {string} location
     * @property {number} location_id
     * @property {string} religion
     * @property {string} smoking
     * @property {string} want_kids
     */

    /** @type {[Preferences, React.Dispatch<React.SetStateAction<Preferences>>]} */
    const [preferences, setPreferences] = useState({});
    const [refresh_, setRefresh_] = useState(false);
    const navigate = useNavigate();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    useEffect(() => {
        (async () => {
            const response = await fetch(`${API_URL}customer/user/preferences`, {
                headers: {
                    Authorization: `Bearer ${cookies.getCookie('token')}`
                }
            });
            const data = await response.json();
            if (!data) return;
            console.log(data);
            setPreferences(data);
        })()
    }, [refresh_])

    /**
     * @param {SelectedPreference} preference
     * @returns {void}
     */
    function handlePreferenceClick(preference) {
        setShow(true);
        setSelectedPreference(preference);
    }

    useEffect(() => {
        if (!selectedPreference.optionsApiEndpoint || !show) return;
        console.log(selectedPreference.optionsApiEndpoint);
        (async () => {
            const response = await fetch(`${API_URL}customer/user/preferences/options/${selectedPreference.optionsApiEndpoint}`, {
                headers: {
                    Authorization: `Bearer ${cookies.getCookie('token')}`
                }
            });
            const data = await response.json();
            if (!data) return;
           console.log(data);
            setSelectedPreferenceOptions(data)
            console.log("prefrance called")
        })()
    }, [show]);

    /**
     * 
     * @param {React.FormEvent<HTMLFormElement>} e 
     * @returns {Promise<void>}
     */
    async function handlePreferenceSave(e) {
        e.preventDefault();

        let bodyContent = { value };

        if (selectedPreference.saveApiEndpoint === "age") {
            bodyContent = {
                age_from: value[0],
                age_to: value[1]
            }
        } else if (selectedPreference.saveApiEndpoint === "location") {
            bodyContent = {
                location_id: value
            }
            console.log(bodyContent);
        }

        try {
            const response = await fetch(`${API_URL}customer/user/preferences/save/${selectedPreference.saveApiEndpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookies.getCookie('token')}`
                },
                body: JSON.stringify(bodyContent)
            });
            if (response.ok) {
                setShow(false);
                setRefresh_(!refresh_);
                cookies.deleteCookie('wave');
                setRefresh(prev => prev + 1);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Sidebar>
            <UpgradeModal show={showUpgradeModal} setShow={setShowUpgradeModal}  />
            <LocationModal show={locationshow} setShow={setLocationshow}  locationId={preferences.location_id} setRefresh_={setRefresh_} refresh_={refresh_}/>
            <Modal size='sm' centered show={show}>
                <Modal.Body>
                    <p style={{
                        fontSize: "large",
                        fontWeight: "600",
                        margin: "0",
                        marginBottom: "1rem"
                    }}>{selectedPreference.title}</p>

                    <form
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            minHeight: "10rem",
                            marginTop: "1rem",
                        }}
                        onSubmit={handlePreferenceSave}
                    >
                        {
                            selectedPreference.element === "age" && (
                                <Forms.Range
                                    age_from={preferences.age_from}
                                    age_to={preferences.age_to}
                                    value={value}
                                    setValue={setValue}
                                />
                            )
                        }
                        {
                            selectedPreference.element === "location" && (
                                <Forms.Location
                                    options={selectedPreferenceOptions}
                                    locationId={preferences.location_id}
                                    value={value}
                                    setValue={setValue}
                                />
                            )
                        }
                        {
                            (selectedPreference.element === "children" || selectedPreference.element === "family") && (
                                <Forms.Radio
                                    options={filteredOptions}
                                    value={value}
                                    setValue={setValue}
                                    selected={preferences[selectedPreference.element === "children" ? "want_kids" : "have_kids"]}
                                />
                            )
                        }
                        {
                            (selectedPreference.element !== "age" && selectedPreference.element !== "location" && selectedPreference.element !== "children" && selectedPreference.element !== "family") && (
                                <Forms.Radio
                                    value={value}
                                    setValue={setValue}
                                    options={filteredOptions}
                                    firstOption={
                                        selectedPreference.optionsApiEndpoint !== "genders" ? {
                                            value: "any",
                                            label: selectedPreference.optionsApiEndpoint === "location" ? "Any" : "Open to all"
                                        } : null
                                    }
                                    selected={preferences[selectedPreference.element]}
                                />
                            )
                        }

                        <div style={{ flexGrow: "1" }}></div>
                        <div style={{
                            marginTop: "1rem",
                            display: "flex",
                            gap: "1rem",
                            marginInline: "auto"
                        }}>
                            <button type="button"
                                className='global-cancel-button'
                                // style={{
                                //     backgroundClip: "text",
                                //     color: "transparent",
                                //     border: "2px solid #fa806d",
                                //     borderRadius: "9999px"
                                // }} 

                                onClick={() => {
                                    setShow(false);
                                   setValue("")
                                  }}>Cancel</button>
                            <button
                                className='global-save-button'
                            // style={{
                            //     borderRadius: "9999px"
                            // }}

                            >Save</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <div style={{
                height: '100%',
                width: '100%',
                flex: '1',
                overflowY: 'auto',
                padding: "1rem"
            }}>
                <p style={{
                    fontSize: "large",
                    fontWeight: "600",
                    margin: "0",
                    marginBottom: "0.5rem"
                }}>Search Preferences</p>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "1rem",
                    margin: "0"
                }}>
                    <p style={{
                        fontSize: "small",
                        fontWeight: "400",
                        margin: "0",
                    }}>Click on options to edit</p>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.8091 10.4501C17.4996 10.4489 17.1971 10.542 16.942 10.7172C16.837 10.4143 16.6406 10.1515 16.3799 9.96498C16.1192 9.77847 15.8071 9.67746 15.4865 9.67591C15.177 9.67467 14.8745 9.76785 14.6194 9.943C14.5144 9.64013 14.318 9.3773 14.0573 9.19079C13.7966 9.00427 13.4845 8.90327 13.1639 8.90171C12.891 8.90286 12.6235 8.97776 12.3897 9.11849V5.41784C12.3899 5.18781 12.3388 4.96063 12.2402 4.75282C12.1415 4.54501 11.9978 4.36178 11.8195 4.21646C11.6412 4.07114 11.4328 3.96737 11.2093 3.9127C10.9859 3.85804 10.7531 3.85384 10.5278 3.90042C10.172 3.98061 9.85479 4.18119 9.62979 4.46825C9.4048 4.75531 9.28582 5.11125 9.29296 5.47591V14.4527L8.23231 13.2411C7.90429 12.8689 7.44587 12.6369 6.95171 12.5929C6.45755 12.549 5.96538 12.6965 5.57683 13.0049L5.30586 13.2217C5.08525 13.3924 4.93554 13.6386 4.88552 13.913C4.83549 14.1874 4.8887 14.4706 5.03489 14.7082L7.79489 19.1598C8.32483 20.1291 9.09924 20.9428 10.0412 21.5201C10.9831 22.0973 12.0597 22.4179 13.1639 22.4501C14.8066 22.4501 16.3819 21.7976 17.5434 20.6361C18.7049 19.4745 19.3575 17.8992 19.3575 16.2566V11.9985C19.3575 11.5878 19.1943 11.194 18.904 10.9036C18.6136 10.6132 18.2197 10.4501 17.8091 10.4501ZM18.5833 16.2566C18.5833 17.6939 18.0123 19.0723 16.996 20.0886C15.9797 21.1049 14.6012 21.6759 13.1639 21.6759C12.1941 21.6434 11.2497 21.3576 10.4245 20.8469C9.59942 20.3362 8.92237 19.6185 8.4607 18.7649L5.70844 14.2901C5.66384 14.2158 5.64751 14.128 5.66244 14.0427C5.67737 13.9574 5.72257 13.8803 5.78973 13.8256L6.0607 13.6088C6.29386 13.4246 6.58877 13.3368 6.88472 13.3634C7.18067 13.3901 7.45515 13.5291 7.65167 13.752L9.38973 15.7378C9.44171 15.7968 9.51039 15.8385 9.58665 15.8575C9.66291 15.8764 9.74313 15.8717 9.81665 15.844C9.89018 15.8163 9.95352 15.7668 9.99827 15.7022C10.043 15.6376 10.067 15.5609 10.0672 15.4824V5.47591C10.0583 5.28811 10.1143 5.10299 10.2256 4.9515C10.3369 4.8 10.4969 4.69133 10.6788 4.64365C10.8052 4.61721 10.9363 4.62284 11.06 4.66003C11.1838 4.69721 11.2962 4.76478 11.3872 4.85655C11.461 4.92994 11.5193 5.01748 11.5585 5.11392C11.5978 5.21037 11.6172 5.31373 11.6155 5.41784V13.1598C11.6155 13.2624 11.6563 13.3609 11.7289 13.4335C11.8015 13.5061 11.9 13.5469 12.0026 13.5469C12.1053 13.5469 12.2038 13.5061 12.2764 13.4335C12.3489 13.3609 12.3897 13.2624 12.3897 13.1598V10.4501C12.3897 10.2448 12.4713 10.0479 12.6165 9.90266C12.7617 9.75747 12.9586 9.67591 13.1639 9.67591C13.3693 9.67591 13.5662 9.75747 13.7114 9.90266C13.8566 10.0479 13.9381 10.2448 13.9381 10.4501V13.1598C13.9381 13.2624 13.9789 13.3609 14.0515 13.4335C14.1241 13.5061 14.2226 13.5469 14.3252 13.5469C14.4279 13.5469 14.5263 13.5061 14.5989 13.4335C14.6715 13.3609 14.7123 13.2624 14.7123 13.1598V11.2243C14.7123 11.019 14.7939 10.822 14.9391 10.6769C15.0843 10.5317 15.2812 10.4501 15.4865 10.4501C15.6918 10.4501 15.8888 10.5317 16.0339 10.6769C16.1791 10.822 16.2607 11.019 16.2607 11.2243V13.1598C16.2607 13.2624 16.3015 13.3609 16.3741 13.4335C16.4467 13.5061 16.5451 13.5469 16.6478 13.5469C16.7505 13.5469 16.8489 13.5061 16.9215 13.4335C16.9941 13.3609 17.0349 13.2624 17.0349 13.1598V11.9985C17.0349 11.7932 17.1165 11.5962 17.2616 11.451C17.4068 11.3059 17.6038 11.2243 17.8091 11.2243C18.0144 11.2243 18.2113 11.3059 18.3565 11.451C18.5017 11.5962 18.5833 11.7932 18.5833 11.9985V16.2566ZM10.8413 3.48236C10.944 3.48236 11.0425 3.44158 11.1151 3.36898C11.1877 3.29639 11.2284 3.19793 11.2284 3.09526V1.93397C11.2284 1.83131 11.1877 1.73285 11.1151 1.66025C11.0425 1.58766 10.944 1.54688 10.8413 1.54688C10.7387 1.54688 10.6402 1.58766 10.5676 1.66025C10.495 1.73285 10.4542 1.83131 10.4542 1.93397V3.09526C10.4542 3.19793 10.495 3.29639 10.5676 3.36898C10.6402 3.44158 10.7387 3.48236 10.8413 3.48236Z" fill="#6C6C6C" />
                        <path d="M13.1588 5.03157C13.1588 5.13424 13.1996 5.2327 13.2721 5.30529C13.3447 5.37789 13.4432 5.41867 13.5459 5.41867H14.7072C14.8098 5.41867 14.9083 5.37789 14.9809 5.30529C15.0535 5.2327 15.0943 5.13424 15.0943 5.03157C15.0943 4.92891 15.0535 4.83045 14.9809 4.75786C14.9083 4.68526 14.8098 4.64448 14.7072 4.64448H13.5459C13.4432 4.64448 13.3447 4.68526 13.2721 4.75786C13.1996 4.83045 13.1588 4.92891 13.1588 5.03157ZM6.96522 5.41867H8.12651C8.22918 5.41867 8.32764 5.37789 8.40023 5.30529C8.47283 5.2327 8.51361 5.13424 8.51361 5.03157C8.51361 4.92891 8.47283 4.83045 8.40023 4.75786C8.32764 4.68526 8.22918 4.64448 8.12651 4.64448H6.96522C6.86256 4.64448 6.7641 4.68526 6.6915 4.75786C6.61891 4.83045 6.57812 4.92891 6.57812 5.03157C6.57812 5.13424 6.61891 5.2327 6.6915 5.30529C6.7641 5.37789 6.86256 5.41867 6.96522 5.41867ZM8.62587 3.75803C8.66185 3.79431 8.70467 3.82311 8.75184 3.84276C8.79901 3.86241 8.8496 3.87253 8.90071 3.87253C8.95181 3.87253 9.0024 3.86241 9.04957 3.84276C9.09675 3.82311 9.13956 3.79431 9.17554 3.75803C9.21183 3.72204 9.24062 3.67923 9.26028 3.63206C9.27993 3.58488 9.29005 3.53429 9.29005 3.48319C9.29005 3.43209 9.27993 3.38149 9.26028 3.33432C9.24062 3.28715 9.21183 3.24433 9.17554 3.20835L8.40135 2.43415C8.36526 2.39806 8.32241 2.36943 8.27525 2.3499C8.2281 2.33037 8.17755 2.32031 8.12651 2.32031C8.02343 2.32031 7.92457 2.36126 7.85167 2.43415C7.77878 2.50705 7.73783 2.60591 7.73783 2.70899C7.73783 2.81208 7.77878 2.91094 7.85167 2.98383L8.62587 3.75803ZM12.7717 3.87028C12.8226 3.87058 12.8731 3.86081 12.9203 3.84155C12.9674 3.82229 13.0103 3.7939 13.0465 3.75803L13.8207 2.98383C13.8568 2.94774 13.8854 2.90489 13.905 2.85773C13.9245 2.81058 13.9345 2.76004 13.9345 2.70899C13.9345 2.65795 13.9245 2.60741 13.905 2.56025C13.8854 2.51309 13.8568 2.47025 13.8207 2.43415C13.7846 2.39806 13.7418 2.36943 13.6946 2.3499C13.6475 2.33037 13.5969 2.32031 13.5459 2.32031C13.4948 2.32031 13.4443 2.33037 13.3971 2.3499C13.35 2.36943 13.3071 2.39806 13.271 2.43415L12.4968 3.20835C12.4606 3.24433 12.4318 3.28715 12.4121 3.33432C12.3925 3.38149 12.3823 3.43209 12.3823 3.48319C12.3823 3.53429 12.3925 3.58488 12.4121 3.63206C12.4318 3.67923 12.4606 3.72204 12.4968 3.75803C12.533 3.7939 12.5759 3.82229 12.6231 3.84155C12.6702 3.86081 12.7207 3.87058 12.7717 3.87028Z" fill="#6C6C6C" />
                    </svg>
                </div>
                <div className={styles.preferences}>
                <Button
                        style={{
                            borderRadius: "9999px",
                            width: "15rem",
                            
                        }}
                        onClick={() => (window.location.href = "/user/home")}
                    >Apply</Button>
                    <div className={styles.option}>
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="18" cy="18" r="18" fill="#F7ECFF" />
                            <path d="M28.2501 13.835V17.195C28.2501 17.2613 28.2237 17.3249 28.1768 17.3718C28.1299 17.4187 28.0664 17.445 28.0001 17.445H26.9751C26.9088 17.445 26.8452 17.4187 26.7983 17.3718C26.7514 17.3249 26.7251 17.2613 26.7251 17.195V16.19L25.7101 17.205C26.434 18.1661 26.8254 19.3368 26.8251 20.54C26.8251 20.71 26.8151 20.88 26.8051 21.045C26.8136 21.0759 26.817 21.108 26.8151 21.14C26.7117 22.1823 26.3144 23.1738 25.6696 23.9992C25.0248 24.8245 24.1589 25.4499 23.1726 25.8024C22.1863 26.1549 21.1202 26.2201 20.0983 25.9904C19.0764 25.7608 18.1407 25.2457 17.4001 24.505C16.4763 23.5759 15.9097 22.3507 15.8001 21.045C15.7951 20.99 15.7901 20.935 15.7901 20.88C16.3647 20.6137 16.8944 20.2594 17.3601 19.83C17.3157 20.0641 17.2939 20.3018 17.2951 20.54C17.2944 21.1989 17.4563 21.8478 17.7665 22.4292C18.0767 23.0105 18.5255 23.5064 19.0731 23.8727C19.6208 24.2391 20.2504 24.4647 20.9061 24.5295C21.5618 24.5943 22.2234 24.4964 22.8322 24.2443C23.441 23.9922 23.9781 23.5939 24.3961 23.0845C24.8141 22.5751 25.0999 21.9705 25.2283 21.3242C25.3567 20.6779 25.3236 20.01 25.132 19.3795C24.9405 18.7491 24.5963 18.1756 24.1301 17.71C23.8488 17.4329 23.5309 17.1956 23.1851 17.005H23.1801C22.836 16.8212 22.4672 16.6882 22.0851 16.61C21.8264 16.5598 21.5635 16.5347 21.3001 16.535C20.5076 16.5376 19.7335 16.7741 19.0751 17.215C18.8569 17.3588 18.6541 17.5246 18.4701 17.71C18.3782 17.8002 18.2914 17.8953 18.2101 17.995C18.0734 18.1627 17.9513 18.3417 17.8451 18.53C17.8351 18.535 17.8301 18.54 17.8351 18.545C17.5188 18.9996 17.1342 19.4027 16.6951 19.74C16.4146 19.9558 16.117 20.1481 15.8051 20.315C15.8001 20.32 15.7951 20.32 15.7901 20.325C15.771 20.3355 15.7509 20.3439 15.7301 20.35C15.2054 20.6132 14.6413 20.7889 14.0601 20.87C14.0542 20.874 14.0471 20.8758 14.0401 20.875V22.02H15.1501C15.2164 22.02 15.2799 22.0464 15.3268 22.0933C15.3737 22.1401 15.4001 22.2037 15.4001 22.27V23.295C15.4001 23.3613 15.3737 23.4249 15.3268 23.4718C15.2799 23.5187 15.2164 23.545 15.1501 23.545H14.0401V24.67C14.039 24.736 14.0124 24.799 13.9657 24.8457C13.919 24.8923 13.856 24.919 13.7901 24.92H12.7651C12.6987 24.92 12.6352 24.8937 12.5883 24.8468C12.5414 24.7999 12.5151 24.7363 12.5151 24.67V23.545H11.4101C11.3437 23.545 11.2802 23.5187 11.2333 23.4718C11.1864 23.4249 11.1601 23.3613 11.1601 23.295V22.27C11.1601 22.2037 11.1864 22.1401 11.2333 22.0933C11.2802 22.0464 11.3437 22.02 11.4101 22.02H12.5151V20.875C11.1915 20.6966 9.97803 20.0426 9.10122 19.0351C8.22441 18.0277 7.74415 16.7356 7.75005 15.4C7.75247 14.2538 8.10869 13.1362 8.77005 12.2C9.27989 11.4789 9.9559 10.8911 10.7409 10.4864C11.5259 10.0817 12.3969 9.87199 13.2801 9.87503C13.5613 9.87581 13.8421 9.89754 14.1201 9.94003C14.9553 10.0639 15.7505 10.3793 16.4435 10.8616C17.1366 11.3438 17.7087 11.9799 18.1151 12.72V12.725C18.479 13.3822 18.7037 14.1072 18.7751 14.855V14.88C18.7801 14.94 18.7901 15 18.7901 15.06C18.5596 15.163 18.3373 15.2834 18.1251 15.42C17.7993 15.6188 17.4944 15.85 17.2151 16.11C17.3285 15.4753 17.2868 14.8225 17.0935 14.2073C16.9002 13.5921 16.561 13.0328 16.1049 12.577C15.6488 12.1211 15.0892 11.7824 14.4739 11.5895C13.8586 11.3966 13.2057 11.3553 12.571 11.4692C11.9363 11.5831 11.3386 11.8487 10.8287 12.2435C10.3188 12.6382 9.91193 13.1504 9.64272 13.7364C9.3735 14.3223 9.24994 14.9647 9.28256 15.6087C9.31518 16.2527 9.50301 16.8793 9.83005 17.435C10.3508 18.3085 11.1806 18.9544 12.1551 19.245C12.2999 19.286 12.4467 19.3194 12.5951 19.345C13.2965 19.4677 14.018 19.4003 14.6845 19.1497C15.351 18.8991 15.9382 18.4745 16.3851 17.92C16.3901 17.915 16.3901 17.915 16.3901 17.91C16.4401 17.85 16.4901 17.785 16.5351 17.72C16.5401 17.715 16.5401 17.71 16.5501 17.705C16.5606 17.6835 16.7041 17.4785 16.7151 17.445C16.7151 17.445 16.7181 17.4415 16.7201 17.44C17.0973 16.8831 17.5735 16.4001 18.1251 16.015C18.2569 15.921 18.3938 15.8342 18.5351 15.755C18.8382 15.574 19.16 15.4265 19.4951 15.315C20.3524 15.021 21.2688 14.9415 22.164 15.0836C23.0592 15.2257 23.9059 15.585 24.6301 16.13L25.6451 15.11H24.6401C24.5737 15.11 24.5102 15.0837 24.4633 15.0368C24.4164 14.9899 24.3901 14.9263 24.3901 14.86V13.835C24.3901 13.7687 24.4164 13.7051 24.4633 13.6583C24.5102 13.6114 24.5737 13.585 24.6401 13.585H28.0001C28.0664 13.585 28.1299 13.6114 28.1768 13.6583C28.2237 13.7051 28.2501 13.7687 28.2501 13.835Z" fill="#6C6C6C" />
                        </svg>
                        <p>I&apos;m interested in</p>
                        <div style={{ flexGrow: "1" }}></div>
                        <p
                            onClick={() => handlePreferenceClick({
                                title: "I'm interested in",
                                type: "radio",
                                optionsApiEndpoint: "genders",
                                saveApiEndpoint: "gender_id",
                                element: "gender"
                            })}
                        ><p>{preferences?.gender === "Other" ? "Everyone" : preferences?.gender ?? "Everyone"}</p>
</p>
                    </div>
                    <div className={styles.option}>
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="18" cy="18" r="18" fill="#F7ECFF" />
                            <g clip-path="url(#clip0_778_16194)">
                                <path d="M24.2984 10.7012H11.6984C10.7043 10.7012 9.89844 11.5071 9.89844 12.5012V25.1012C9.89844 26.0953 10.7043 26.9012 11.6984 26.9012H24.2984C25.2925 26.9012 26.0984 26.0953 26.0984 25.1012V12.5012C26.0984 11.5071 25.2925 10.7012 24.2984 10.7012Z" stroke="#6C6C6C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M21.5977 8.90234V12.5023" stroke="#6C6C6C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M14.3984 8.90234V12.5023" stroke="#6C6C6C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9.89844 16.1016H26.0984" stroke="#6C6C6C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_778_16194">
                                    <rect width="18" height="19.8" fill="white" transform="translate(9 8)" />
                                </clipPath>
                            </defs>
                        </svg>
                        <p>Age range</p>
                        <div style={{ flexGrow: "1" }}></div>
                        <p
                            onClick={() => handlePreferenceClick({
                                title: "Age Range",
                                type: "range",
                                optionsApiEndpoint: "",
                                saveApiEndpoint: "age",
                                element: "age"
                            })}
                        >{preferences?.age_from ? `${preferences?.age_from}-${preferences?.age_to}` : "Any"}</p>
                    </div>
                    <div className={styles.option}>
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="18" cy="18" r="18" fill="#F7ECFF" />
                            <path d="M27.9289 26.6648L25.715 24.0988C25.8793 23.9652 26.0011 23.7866 26.0653 23.5848C26.1295 23.383 26.1334 23.1669 26.0765 22.9629C26.0196 22.759 25.9044 22.5761 25.745 22.4367C25.5857 22.2973 25.389 22.2074 25.1793 22.1782C25.1819 22.1659 25.1846 22.1537 25.1867 22.1413C25.224 21.9293 25.1976 21.711 25.1108 21.5141C25.024 21.3172 24.8808 21.1504 24.6992 21.0348C24.5176 20.9193 24.3058 20.8602 24.0907 20.865C23.8755 20.8699 23.6666 20.9384 23.4904 21.0619L23.2443 21.2344L22.3512 20.1993C22.3232 20.1671 22.3027 20.1291 22.291 20.0881C22.2794 20.047 22.2769 20.004 22.2837 19.9619C22.2845 19.957 22.2852 19.9521 22.2857 19.9473L22.7068 16.1618C22.7653 15.7901 22.7203 15.4095 22.5767 15.0616C22.5744 15.0561 22.5719 15.0506 22.5693 15.0451L19.3998 8.5361C19.345 8.40696 19.2601 8.2928 19.1522 8.20314C19.0443 8.11349 18.9165 8.05093 18.7795 8.02069C18.6426 7.99044 18.5003 7.9934 18.3647 8.0293C18.2291 8.0652 18.104 8.13301 18 8.22707C17.8959 8.13302 17.7708 8.06521 17.6352 8.02931C17.4996 7.99341 17.3574 7.99046 17.2204 8.0207C17.0835 8.05093 16.9557 8.11348 16.8478 8.20313C16.7399 8.29278 16.655 8.40693 16.6002 8.53606L13.4307 15.0451C13.4281 15.0506 13.4256 15.0561 13.4233 15.0616C13.2797 15.4095 13.2347 15.7901 13.2932 16.1618L13.7143 19.9473C13.7149 19.9521 13.7155 19.957 13.7163 19.9619C13.7231 20.004 13.7206 20.047 13.709 20.088C13.6973 20.1291 13.6768 20.167 13.6489 20.1992L12.7557 21.2344L12.5097 21.0619C12.3334 20.9384 12.1245 20.8699 11.9094 20.8651C11.6942 20.8603 11.4825 20.9194 11.3009 21.0349C11.1194 21.1504 10.9761 21.3172 10.8893 21.5141C10.8025 21.711 10.7761 21.9293 10.8133 22.1412C10.8154 22.1537 10.8181 22.166 10.8207 22.1782C10.611 22.2075 10.4144 22.2973 10.255 22.4367C10.0957 22.5761 9.98048 22.759 9.92359 22.963C9.8667 23.1669 9.8706 23.383 9.9348 23.5848C9.99901 23.7866 10.1207 23.9652 10.285 24.0988L8.07115 26.6648C8.04602 26.694 8.02687 26.7277 8.01479 26.7643C8.00272 26.8008 7.99796 26.8394 8.00079 26.8777C8.00362 26.9161 8.01398 26.9535 8.03127 26.9879C8.04857 27.0223 8.07247 27.0529 8.1016 27.078C8.13073 27.1032 8.16453 27.1223 8.20106 27.1344C8.23759 27.1465 8.27614 27.1512 8.31452 27.1484C8.35289 27.1456 8.39032 27.1352 8.42469 27.1179C8.45906 27.1006 8.48969 27.0767 8.51482 27.0476L10.7652 24.4391L13.5482 26.3901L12.6087 27.5197C12.559 27.5794 12.5351 27.6564 12.5422 27.7338C12.5493 27.8112 12.5869 27.8826 12.6466 27.9323C12.7064 27.982 12.7834 28.0059 12.8608 27.9988C12.9382 27.9917 13.0096 27.9541 13.0593 27.8943L14.0297 26.7276L14.3498 26.952C14.526 27.0755 14.7349 27.144 14.95 27.1488C15.1652 27.1537 15.377 27.0946 15.5585 26.979C15.7401 26.8635 15.8833 26.6967 15.9701 26.4998C16.0569 26.3028 16.0833 26.0846 16.0461 25.8726C16.0439 25.8601 16.0413 25.8478 16.0387 25.8354C16.2549 25.8052 16.4571 25.7106 16.6188 25.5639C16.7806 25.4172 16.8944 25.2251 16.9455 25.0128C16.9966 24.8005 16.9825 24.5778 16.9053 24.3735C16.828 24.1693 16.691 23.9931 16.5122 23.8678L16.446 23.8214L17.8655 22.1142C17.9141 22.0546 17.959 21.9921 17.9999 21.9271C18.0406 21.9917 18.0852 22.0538 18.1334 22.113L19.5278 23.8397L19.4878 23.8678C19.3089 23.993 19.1718 24.1692 19.0944 24.3735C19.017 24.5778 19.003 24.8006 19.0541 25.013C19.1052 25.2253 19.2191 25.4174 19.3809 25.5641C19.5428 25.7108 19.745 25.8053 19.9614 25.8354C19.9587 25.8478 19.9561 25.8601 19.9539 25.8726C19.9168 26.0845 19.9434 26.3027 20.0302 26.4995C20.1171 26.6963 20.2603 26.863 20.4418 26.9785C20.6233 27.094 20.835 27.1531 21.05 27.1484C21.2651 27.1436 21.474 27.0753 21.6502 26.9519L21.8996 26.7772L22.799 27.8911C22.8478 27.9515 22.9187 27.9901 22.9959 27.9983C23.0732 28.0066 23.1506 27.9837 23.211 27.9349C23.2715 27.8861 23.31 27.8153 23.3183 27.738C23.3265 27.6608 23.3037 27.5834 23.2549 27.5229L22.3805 26.4401L25.2348 24.4391L27.4852 27.0476C27.5103 27.0767 27.5409 27.1006 27.5753 27.1179C27.6097 27.1352 27.6471 27.1456 27.6855 27.1484C27.7239 27.1512 27.7624 27.1465 27.7989 27.1344C27.8355 27.1223 27.8693 27.1032 27.8984 27.078C27.9275 27.0529 27.9514 27.0223 27.9687 26.9879C27.986 26.9535 27.9964 26.9161 27.9992 26.8777C28.002 26.8394 27.9973 26.8008 27.9852 26.7643C27.9731 26.7277 27.954 26.694 27.9289 26.6648ZM15.3856 26.3493C15.309 26.4582 15.1923 26.5322 15.0612 26.5553C14.9301 26.5783 14.7952 26.5484 14.6861 26.4722L10.6835 23.6663C10.6295 23.6285 10.5835 23.5803 10.5481 23.5247C10.5127 23.469 10.4886 23.407 10.4771 23.342C10.4657 23.2771 10.4672 23.2105 10.4815 23.1461C10.4958 23.0817 10.5226 23.0208 10.5605 22.9668C10.5984 22.9127 10.6465 22.8667 10.7021 22.8313C10.7578 22.7959 10.8198 22.7718 10.8848 22.7604C10.9498 22.7489 11.0163 22.7504 11.0807 22.7647C11.1451 22.779 11.206 22.8059 11.2601 22.8437L11.2604 22.844L11.5947 23.0784L11.5977 23.0804L14.8272 25.3443C14.8301 25.3464 14.833 25.3485 14.836 25.3506L15.2629 25.6497C15.3719 25.7262 15.446 25.8429 15.469 25.9741C15.492 26.1053 15.462 26.2402 15.3856 26.3492V26.3493ZM16.2987 25.0472C16.2221 25.1561 16.1055 25.2302 15.9744 25.2532C15.8433 25.2762 15.7084 25.2463 15.5993 25.1701L11.9275 22.5961C11.9259 22.595 11.9244 22.5939 11.9228 22.5928L11.5967 22.3643C11.4877 22.2878 11.4134 22.1712 11.3904 22.04C11.3673 21.9088 11.3973 21.7738 11.4738 21.6647C11.5502 21.5556 11.6669 21.4814 11.7981 21.4583C11.9293 21.4353 12.0643 21.4653 12.1733 21.5417L12.6328 21.8638C12.6354 21.8657 12.6379 21.8675 12.6406 21.8693L16.1758 24.3476C16.2298 24.3854 16.2759 24.4335 16.3113 24.4892C16.3467 24.5448 16.3708 24.6069 16.3822 24.6719C16.3936 24.7369 16.3921 24.8034 16.3778 24.8678C16.3635 24.9322 16.3366 24.9932 16.2987 25.0472ZM17.707 14.832C17.3508 14.839 17.0094 14.9758 16.7469 15.2168C16.4845 15.4578 16.3191 15.7863 16.2818 16.1407L16.0151 18.6386C16.0069 18.7158 16.0297 18.7932 16.0785 18.8537C16.1273 18.9141 16.1981 18.9527 16.2754 18.961C16.3526 18.9692 16.43 18.9464 16.4905 18.8976C16.5509 18.8488 16.5895 18.778 16.5978 18.7007L16.8645 16.2028C16.8866 15.9924 16.984 15.797 17.1389 15.6527C17.2937 15.5084 17.4955 15.425 17.707 15.4178V20.9156C17.7068 21.2165 17.6032 21.5081 17.4134 21.7416L15.9646 23.4839L13.2379 21.5724L14.0926 20.582C14.1756 20.486 14.2368 20.3732 14.2719 20.2513C14.307 20.1294 14.3152 20.0013 14.2959 19.8759L13.8748 16.0903C13.8743 16.0856 13.8736 16.0809 13.8729 16.0762C13.8303 15.8119 13.861 15.5411 13.9617 15.2931L17.1306 8.78532C17.1332 8.77992 17.1357 8.77442 17.138 8.76891C17.1642 8.70575 17.2114 8.65362 17.2717 8.62139C17.332 8.58915 17.4016 8.57879 17.4687 8.59208C17.5358 8.60536 17.5962 8.64147 17.6396 8.69427C17.6831 8.74706 17.7069 8.81327 17.707 8.88164V14.832ZM18.5882 21.7436C18.3976 21.5098 18.2933 21.2174 18.293 20.9156V15.4177C18.5045 15.4249 18.7063 15.5083 18.8611 15.6526C19.016 15.7969 19.1134 15.9923 19.1355 16.2028L19.4022 18.7007C19.4105 18.778 19.4491 18.8488 19.5095 18.8976C19.57 18.9464 19.6474 18.9692 19.7246 18.9609C19.8019 18.9527 19.8727 18.9141 19.9215 18.8536C19.9703 18.7932 19.9931 18.7158 19.9849 18.6385L19.7182 16.1406C19.6809 15.7863 19.5155 15.4577 19.2531 15.2168C18.9906 14.9758 18.6492 14.839 18.293 14.832V8.88164C18.293 8.8132 18.3167 8.74687 18.3602 8.69398C18.4036 8.64109 18.4641 8.60491 18.5312 8.5916C18.5984 8.5783 18.668 8.58871 18.7284 8.62104C18.7887 8.65337 18.8359 8.70563 18.862 8.76891C18.8643 8.77442 18.8668 8.77992 18.8694 8.78532L22.0383 15.2932C22.139 15.5411 22.1697 15.812 22.1271 16.0762C22.1264 16.0809 22.1257 16.0855 22.1252 16.0903L21.7041 19.8759C21.6848 20.0013 21.693 20.1294 21.7281 20.2513C21.7633 20.3732 21.8244 20.4861 21.9075 20.582L22.7621 21.5725L20.0087 23.5026L18.5882 21.7436ZM19.7013 25.0472C19.6634 24.9932 19.6365 24.9323 19.6222 24.8679C19.6079 24.8035 19.6064 24.7369 19.6178 24.672C19.6292 24.607 19.6533 24.5449 19.6887 24.4892C19.7241 24.4336 19.7701 24.3855 19.8241 24.3476L23.3599 21.869C23.3622 21.8675 23.3645 21.8658 23.3668 21.8642L23.8267 21.5418C23.9358 21.4653 24.0708 21.4353 24.2019 21.4584C24.3331 21.4814 24.4498 21.5557 24.5262 21.6647C24.6027 21.7738 24.6327 21.9088 24.6096 22.04C24.5866 22.1712 24.5123 22.2878 24.4033 22.3643L20.7923 24.8956C20.79 24.8971 20.7878 24.8987 20.7856 24.9003L20.4007 25.1701C20.2916 25.2464 20.1567 25.2764 20.0256 25.2533C19.8945 25.2303 19.7778 25.1561 19.7013 25.0472ZM25.5228 23.342C25.5116 23.407 25.4876 23.4692 25.4521 23.5249C25.4167 23.5805 25.3706 23.6286 25.3164 23.6663L21.3139 26.4722C21.2599 26.5101 21.199 26.5369 21.1346 26.5513C21.0702 26.5656 21.0037 26.5671 20.9387 26.5557C20.8738 26.5443 20.8117 26.5202 20.756 26.4848C20.7004 26.4494 20.6522 26.4034 20.6144 26.3494C20.5765 26.2954 20.5496 26.2345 20.5353 26.1701C20.521 26.1057 20.5195 26.0391 20.5309 25.9742C20.5423 25.9092 20.5663 25.8471 20.6017 25.7915C20.6371 25.7358 20.6831 25.6877 20.7371 25.6498L24.7396 22.844L24.7398 22.8439L24.7399 22.8438C24.8213 22.7869 24.9177 22.7553 25.017 22.753C25.1163 22.7508 25.214 22.7781 25.2978 22.8314C25.3816 22.8847 25.4477 22.9617 25.4877 23.0526C25.5278 23.1435 25.54 23.2442 25.5228 23.342Z" fill="#6C6C6C" />
                        </svg>
                        <p>Religion</p>
                        <div style={{ flexGrow: "1" }}></div>
                        <p
                            onClick={() => handlePreferenceClick({
                                title: "Religion",
                                type: "radio",
                                optionsApiEndpoint: "religions",
                                saveApiEndpoint: "religion_id",
                                element: "religion"
                            })}
                        >{preferences?.religion ?? "Open to all"}</p>
                    </div>
                    {
                        cookies.getCookie("isPremium") !== "true" && (
                            <Button
                                style={{
                                    marginTop: "2.4rem",
                                }}
                                onClick={() => navigate("/selectplan")}
                            >
                                Premium Filters - Upgrade for Access
                                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.4987 10.8307C10.245 10.8278 9.99646 10.9026 9.78657 11.0451C9.57667 11.1877 9.41549 11.3911 9.32471 11.6281C9.23393 11.865 9.21792 12.1241 9.27882 12.3704C9.33973 12.6167 9.47463 12.8384 9.66537 13.0057V14.1641C9.66537 14.3851 9.75316 14.597 9.90944 14.7533C10.0657 14.9096 10.2777 14.9974 10.4987 14.9974C10.7197 14.9974 10.9317 14.9096 11.088 14.7533C11.2442 14.597 11.332 14.3851 11.332 14.1641V13.0057C11.5228 12.8384 11.6577 12.6167 11.7186 12.3704C11.7795 12.1241 11.7635 11.865 11.6727 11.6281C11.5819 11.3911 11.4207 11.1877 11.2108 11.0451C11.0009 10.9026 10.7524 10.8278 10.4987 10.8307ZM14.6654 7.4974V5.83073C14.6654 4.72566 14.2264 3.66585 13.445 2.88445C12.6636 2.10305 11.6038 1.66406 10.4987 1.66406C9.39363 1.66406 8.33382 2.10305 7.55242 2.88445C6.77102 3.66585 6.33203 4.72566 6.33203 5.83073V7.4974C5.66899 7.4974 5.03311 7.76079 4.56426 8.22963C4.09542 8.69847 3.83203 9.33435 3.83203 9.9974V15.8307C3.83203 16.4938 4.09542 17.1297 4.56426 17.5985C5.03311 18.0673 5.66899 18.3307 6.33203 18.3307H14.6654C15.3284 18.3307 15.9643 18.0673 16.4331 17.5985C16.902 17.1297 17.1654 16.4938 17.1654 15.8307V9.9974C17.1654 9.33435 16.902 8.69847 16.4331 8.22963C15.9643 7.76079 15.3284 7.4974 14.6654 7.4974ZM7.9987 5.83073C7.9987 5.16769 8.26209 4.5318 8.73093 4.06296C9.19977 3.59412 9.83566 3.33073 10.4987 3.33073C11.1617 3.33073 11.7976 3.59412 12.2665 4.06296C12.7353 4.5318 12.9987 5.16769 12.9987 5.83073V7.4974H7.9987V5.83073ZM15.4987 15.8307C15.4987 16.0517 15.4109 16.2637 15.2546 16.42C15.0983 16.5763 14.8864 16.6641 14.6654 16.6641H6.33203C6.11102 16.6641 5.89906 16.5763 5.74278 16.42C5.5865 16.2637 5.4987 16.0517 5.4987 15.8307V9.9974C5.4987 9.77638 5.5865 9.56442 5.74278 9.40814C5.89906 9.25186 6.11102 9.16406 6.33203 9.16406H14.6654C14.8864 9.16406 15.0983 9.25186 15.2546 9.40814C15.4109 9.56442 15.4987 9.77638 15.4987 9.9974V15.8307Z" fill="white" />
                                </svg>
                            </Button>
                        )
                    }
                    <div className={styles.preferences} style={{
                        width: "100%",
                        marginTop: "-0.25rem",
                        position: "relative",
                    }}>
                        {
                            cookies.getCookie("isPremium") !== "true" && (
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: "0",
                                    }}
                                    onClick={() => setShowUpgradeModal(true)}
                                ></div>
                            )
                        }
                        <div className={styles.option}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="18" cy="18" r="18" fill="#F7ECFF" />
                                <path d="M18 20C19.6569 20 21 18.6569 21 17C21 15.3431 19.6569 14 18 14C16.3431 14 15 15.3431 15 17C15 18.6569 16.3431 20 18 20Z" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M18 27C22.4183 25 26 21.4183 26 17C26 12.5817 22.4183 9 18 9C13.5817 9 10 12.5817 10 17C10 21.4183 13.5817 25 18 27Z" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p>Location</p>
                            <div style={{ flexGrow: "1" }}></div>
                            <p
                            onClick={()=> setLocationshow(true)}
                                // onClick={() => handlePreferenceClick({
                                //     title: "Location",
                                //     type: "location",
                                //     optionsApiEndpoint: "locations",
                                //     saveApiEndpoint: "location",
                                //     element: "location"
                                // })}
                            >{preferences?.location ?? "Open to all"}</p>
                        </div>
                        <div className={styles.option}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="18" cy="18" r="18" fill="#F7ECFF" />
                                <path d="M23.9841 17.375C23.8804 17.375 23.7808 17.4162 23.7074 17.4896C23.6341 17.563 23.5928 17.6625 23.5928 17.7663V22.0633C23.5936 22.1397 23.5757 22.2151 23.5407 22.283C23.3205 22.703 22.277 24.0747 18.1031 24.0747C13.9292 24.0747 12.8857 22.7046 12.6629 22.284C12.628 22.2163 12.6101 22.1411 12.6108 22.0649V17.9322C12.6108 17.8284 12.5695 17.7289 12.4961 17.6555C12.4228 17.5821 12.3232 17.5409 12.2194 17.5409C12.1157 17.5409 12.0161 17.5821 11.9428 17.6555C11.8694 17.7289 11.8281 17.8284 11.8281 17.9322V22.0633C11.8271 22.2664 11.875 22.4667 11.968 22.6472C12.3196 23.3113 13.6161 24.8573 18.1031 24.8573C22.5901 24.8573 23.8861 23.3129 24.2351 22.6493C24.3288 22.4688 24.3772 22.2682 24.376 22.0649V17.7663C24.376 17.7149 24.3658 17.6639 24.3461 17.6164C24.3264 17.5689 24.2976 17.5258 24.2612 17.4894C24.2248 17.4531 24.1816 17.4243 24.134 17.4046C24.0865 17.385 24.0356 17.3749 23.9841 17.375Z" fill="#6C6C6C" />
                                <path d="M29.2103 15.0718L18.858 11.6137C18.7789 11.5871 18.6934 11.5871 18.6143 11.6137L6.95293 15.3525C6.87506 15.3781 6.80719 15.4275 6.75888 15.4937C6.71057 15.56 6.68424 15.6397 6.68361 15.7216C6.68297 15.8036 6.70806 15.8837 6.75535 15.9507C6.80263 16.0176 6.86973 16.0681 6.94719 16.0949L17.8515 19.7805C17.8919 19.7941 17.9342 19.8012 17.9768 19.8014C18.0216 19.8013 18.066 19.7935 18.1082 19.7784L26.1122 16.9203V18.7986C25.8424 18.88 25.6059 19.046 25.4375 19.272C25.2691 19.498 25.1777 19.772 25.1768 20.0539V20.8427C25.1768 21.1926 25.3157 21.528 25.5631 21.7754C25.8104 22.0227 26.1459 22.1617 26.4957 22.1617C26.8455 22.1617 27.181 22.0227 27.4284 21.7754C27.6757 21.528 27.8147 21.1926 27.8147 20.8427V20.0528C27.8139 19.7735 27.7244 19.5017 27.5591 19.2766C27.3938 19.0516 27.1611 18.8849 26.8948 18.8007V16.6407L29.2171 15.8116C29.2938 15.7843 29.3601 15.7336 29.4066 15.6668C29.4532 15.6 29.4778 15.5203 29.4769 15.4389C29.4761 15.3575 29.4498 15.2783 29.4018 15.2125C29.3539 15.1467 29.2865 15.0975 29.2093 15.0718H29.2103ZM27.03 20.8427C27.03 20.985 26.9735 21.1214 26.8729 21.222C26.7723 21.3226 26.6359 21.3791 26.4936 21.3791C26.3514 21.3791 26.215 21.3226 26.1144 21.222C26.0138 21.1214 25.9573 20.985 25.9573 20.8427V20.0528C25.9573 19.9824 25.9711 19.9127 25.9981 19.8476C26.0251 19.7825 26.0646 19.7234 26.1144 19.6736C26.1642 19.6238 26.2233 19.5843 26.2884 19.5573C26.3534 19.5304 26.4232 19.5165 26.4936 19.5165C26.5641 19.5165 26.6338 19.5304 26.6989 19.5573C26.7639 19.5843 26.8231 19.6238 26.8729 19.6736C26.9227 19.7234 26.9622 19.7825 26.9891 19.8476C27.0161 19.9127 27.03 19.9824 27.03 20.0528V20.8427ZM26.4477 15.9697L18.1453 15.0739C18.0935 15.0671 18.041 15.0706 17.9906 15.0844C17.9403 15.0982 17.8932 15.122 17.8522 15.1542C17.8112 15.1865 17.7771 15.2266 17.7518 15.2723C17.7265 15.3179 17.7106 15.3682 17.705 15.4201C17.6995 15.472 17.7043 15.5244 17.7194 15.5744C17.7344 15.6244 17.7592 15.6709 17.7925 15.7111C17.8257 15.7513 17.8667 15.7845 17.9129 15.8086C17.9592 15.8328 18.0098 15.8475 18.0618 15.8518L24.7552 16.5739L17.9726 18.9968L8.32353 15.7349L18.7312 12.3958L27.8882 15.4547L26.4477 15.9697Z" fill="#6C6C6C" />
                            </svg>
                            <p>Education</p>
                            <div style={{ flexGrow: "1" }}></div>
                            <p
                                onClick={() => handlePreferenceClick({
                                    title: "Education",
                                    type: "radio",
                                    optionsApiEndpoint: "studies",
                                    saveApiEndpoint: "education_id",
                                    element: "education"
                                })}
                            >{preferences?.education ?? "Open to all"}</p>
                        </div>
                        <div className={styles.option}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="18" cy="18" r="18" fill="#F7ECFF" />
                                <path d="M11.0899 21.4209H12.4204C12.9297 21.4209 13.418 21.2102 13.7781 20.8352C14.1382 20.4601 14.3404 19.9514 14.3404 19.4209V17.3659C14.3404 16.8355 14.1382 16.3268 13.7781 15.9517C13.418 15.5767 12.9297 15.3659 12.4204 15.3659H11.0899C10.5807 15.3659 10.0923 15.5767 9.73223 15.9517C9.37216 16.3268 9.16987 16.8355 9.16987 17.3659V19.4209C9.16987 19.9514 9.37216 20.4601 9.73223 20.8352C10.0923 21.2102 10.5807 21.4209 11.0899 21.4209ZM10.1299 17.3659C10.1299 17.1007 10.231 16.8464 10.4111 16.6588C10.5911 16.4713 10.8353 16.3659 11.0899 16.3659H12.4204C12.675 16.3659 12.9192 16.4713 13.0993 16.6588C13.2793 16.8464 13.3804 17.1007 13.3804 17.3659V19.4209C13.3804 19.6862 13.2793 19.9405 13.0993 20.128C12.9192 20.3156 12.675 20.4209 12.4204 20.4209H11.0899C10.8353 20.4209 10.5911 20.3156 10.4111 20.128C10.231 19.9405 10.1299 19.6862 10.1299 19.4209V17.3659ZM14.9395 23.8899C14.8376 23.9695 14.7096 24.0037 14.5836 23.9849C14.4576 23.9662 14.3439 23.896 14.2675 23.7899C14.1004 23.5565 13.8831 23.3671 13.633 23.2371C13.3829 23.107 13.107 23.0398 12.8275 23.0409H10.6828C10.2053 23.0417 9.74747 23.2398 9.40987 23.5916C9.07226 23.9435 8.88238 24.4205 8.88187 24.9179V25.8419C9.80335 26.1766 10.7788 26.3203 11.7532 26.2649C12.3633 26.2793 12.9735 26.2398 13.5772 26.1469C13.7028 26.1247 13.8316 26.1552 13.9355 26.2319C14.0394 26.3086 14.1098 26.4252 14.1312 26.5559C14.1525 26.6867 14.1232 26.8209 14.0496 26.9291C13.9759 27.0374 13.864 27.1107 13.7385 27.1329C13.0822 27.2357 12.4187 27.2799 11.7552 27.2649C10.5355 27.3437 9.31515 27.1213 8.19355 26.6159C8.11223 26.5751 8.0436 26.5113 7.99555 26.4317C7.94749 26.3521 7.92196 26.26 7.92188 26.1659V24.9179C7.92264 24.1554 8.21377 23.4244 8.73138 22.8852C9.249 22.346 9.95082 22.0427 10.6828 22.0419H12.8236C13.2523 22.0398 13.6754 22.1426 14.0589 22.342C14.4424 22.5414 14.7756 22.8318 15.0316 23.1899C15.1081 23.2959 15.1411 23.4292 15.1233 23.5604C15.1054 23.6917 15.0383 23.8102 14.9366 23.8899H14.9395ZM28.0819 24.9179V26.1659C28.082 26.2598 28.0567 26.3517 28.009 26.4313C27.9613 26.5109 27.8931 26.5748 27.8121 26.6159C26.6905 27.1213 25.4702 27.3437 24.2505 27.2649C23.587 27.2799 22.9235 27.2357 22.2672 27.1329C22.205 27.1219 22.1455 27.0983 22.0922 27.0633C22.0388 27.0283 21.9925 26.9828 21.9561 26.9292C21.9196 26.8756 21.8936 26.815 21.8797 26.751C21.8657 26.687 21.8639 26.6207 21.8745 26.5559C21.8975 26.426 21.9683 26.3106 22.0717 26.2342C22.1752 26.1578 22.3032 26.1265 22.4284 26.1469C23.0322 26.2398 23.6423 26.2793 24.2524 26.2649C25.2262 26.3201 26.201 26.1764 27.1219 25.8419V24.9179C27.1211 24.4206 26.9311 23.9439 26.5935 23.5923C26.256 23.2406 25.7983 23.0427 25.3209 23.0419H23.1801C22.9006 23.0408 22.6247 23.108 22.3746 23.2381C22.1245 23.3681 21.9072 23.5575 21.7401 23.7909C21.7023 23.8435 21.6549 23.8877 21.6007 23.9212C21.5464 23.9546 21.4864 23.9766 21.424 23.9859C21.3616 23.9952 21.298 23.9916 21.237 23.9753C21.1759 23.959 21.1185 23.9303 21.0681 23.8909C21.0177 23.8515 20.9752 23.8022 20.9431 23.7457C20.911 23.6892 20.8899 23.6266 20.8809 23.5616C20.872 23.4966 20.8755 23.4305 20.8911 23.3668C20.9068 23.3032 20.9343 23.2435 20.9721 23.1909C21.2281 22.8328 21.5613 22.5424 21.9449 22.343C22.3284 22.1436 22.7515 22.0408 23.1801 22.0429H25.3209C26.0528 22.0437 26.7544 22.3469 27.272 22.8858C27.7896 23.4248 28.0809 24.1556 28.0819 24.9179ZM17.5334 18.3329C17.1006 18.3329 16.6855 18.512 16.3794 18.8309C16.0733 19.1497 15.9014 19.5821 15.9014 20.0329V21.5219C15.9014 21.9728 16.0733 22.4052 16.3794 22.724C16.6855 23.0428 17.1006 23.2219 17.5334 23.2219H18.4704C18.9032 23.2219 19.3183 23.0428 19.6244 22.724C19.9304 22.4052 20.1024 21.9728 20.1024 21.5219V20.0329C20.1024 19.5821 19.9304 19.1497 19.6244 18.8309C19.3183 18.512 18.9032 18.3329 18.4704 18.3329H17.5334ZM19.1424 20.0329V21.5219C19.1424 21.7076 19.0716 21.8856 18.9455 22.0169C18.8195 22.1482 18.6486 22.2219 18.4704 22.2219H17.5334C17.3552 22.2219 17.1842 22.1482 17.0582 22.0169C16.9322 21.8856 16.8614 21.7076 16.8614 21.5219V20.0329C16.8614 19.8473 16.9322 19.6692 17.0582 19.538C17.1842 19.4067 17.3552 19.3329 17.5334 19.3329H18.4704C18.6486 19.3329 18.8195 19.4067 18.9455 19.538C19.0716 19.6692 19.1424 19.8473 19.1424 20.0329ZM18.8246 23.7949H17.1792C16.5864 23.7952 16.018 24.0405 15.5988 24.477C15.1796 24.9135 14.9438 25.5055 14.9433 26.1229V27.0829C14.9433 27.1769 14.9687 27.2689 15.0166 27.3485C15.0645 27.4281 15.1329 27.492 15.214 27.5329C16.0905 27.929 17.0444 28.1037 17.998 28.0429C18.9516 28.1037 19.9055 27.929 20.782 27.5329C20.8632 27.492 20.9316 27.4281 20.9795 27.3485C21.0274 27.2689 21.0528 27.1769 21.0528 27.0829V26.1229C21.0523 25.5069 20.8176 24.9161 20.4 24.4798C19.9824 24.0436 19.416 23.7973 18.8246 23.7949ZM20.1004 26.7549C19.4242 26.9861 18.7125 27.0838 18.0019 27.0429C17.2912 27.0838 16.5795 26.9861 15.9033 26.7549V26.1229C15.9038 25.7707 16.0384 25.4331 16.2776 25.1841C16.5168 24.9352 16.841 24.7952 17.1792 24.7949H18.8246C19.1627 24.7952 19.4869 24.9352 19.7261 25.1841C19.9653 25.4331 20.0999 25.7707 20.1004 26.1229V26.7549ZM21.6633 19.4209C21.6633 19.9514 21.8656 20.4601 22.2257 20.8352C22.5857 21.2102 23.0741 21.4209 23.5833 21.4209H24.9139C25.4231 21.4209 25.9114 21.2102 26.2715 20.8352C26.6316 20.4601 26.8339 19.9514 26.8339 19.4209V17.3659C26.8339 16.8355 26.6316 16.3268 26.2715 15.9517C25.9114 15.5767 25.4231 15.3659 24.9139 15.3659H23.5833C23.0741 15.3659 22.5857 15.5767 22.2257 15.9517C21.8656 16.3268 21.6633 16.8355 21.6633 17.3659V19.4209ZM22.6233 17.3659C22.6233 17.1007 22.7245 16.8464 22.9045 16.6588C23.0845 16.4713 23.3287 16.3659 23.5833 16.3659H24.9139C25.1685 16.3659 25.4127 16.4713 25.5927 16.6588C25.7727 16.8464 25.8739 17.1007 25.8739 17.3659V19.4209C25.8739 19.6862 25.7727 19.9405 25.5927 20.128C25.4127 20.3156 25.1685 20.4209 24.9139 20.4209H23.5833C23.3287 20.4209 23.0845 20.3156 22.9045 20.128C22.7245 19.9405 22.6233 19.6862 22.6233 19.4209V17.3659ZM17.0131 15.5779C17.3117 15.7648 17.6535 15.8636 18.0019 15.8636C18.3502 15.8636 18.6921 15.7648 18.9907 15.5779C21.4665 14.0339 21.8361 12.3629 21.8361 11.5049C21.8571 11.1899 21.8177 10.8736 21.7202 10.5745C21.6228 10.2754 21.4692 9.99954 21.2685 9.76282C21.0678 9.52611 20.8239 9.33332 20.551 9.19565C20.2782 9.05799 19.9817 8.97821 19.679 8.96094C19.0674 8.96126 18.4748 9.1821 18.0019 9.58594C17.5289 9.1821 16.9363 8.96126 16.3248 8.96094C16.0223 8.97822 15.7261 9.05791 15.4534 9.19538C15.1807 9.33286 14.937 9.52538 14.7363 9.76177C14.5356 9.99815 14.382 10.2737 14.2844 10.5724C14.1868 10.8712 14.1471 11.1871 14.1676 11.5019C14.1676 12.3629 14.5372 14.0339 17.0131 15.5779ZM16.3248 9.96094C16.571 9.96173 16.8141 10.018 17.0375 10.1259C17.2608 10.2338 17.4592 10.3907 17.6188 10.5859C17.6655 10.645 17.7241 10.6926 17.7905 10.7252C17.8569 10.7579 17.9294 10.7748 18.0028 10.7748C18.0763 10.7748 18.1488 10.7579 18.2152 10.7252C18.2816 10.6926 18.3402 10.645 18.3868 10.5859C18.5475 10.3926 18.7458 10.2372 18.9686 10.1299C19.1914 10.0227 19.4336 9.96608 19.679 9.96394C19.8545 9.98303 20.0248 10.038 20.1799 10.1256C20.3351 10.2132 20.4722 10.3318 20.5834 10.4747C20.6945 10.6175 20.7776 10.7817 20.8278 10.958C20.8781 11.1342 20.8945 11.3191 20.8761 11.5019C20.8761 12.6019 20.0121 13.7739 18.4982 14.7179C18.3477 14.8098 18.1763 14.8582 18.0019 14.8582C17.8274 14.8582 17.6561 14.8098 17.5056 14.7179C15.9945 13.7769 15.1276 12.6019 15.1276 11.5019C15.1089 11.3188 15.125 11.1337 15.175 10.9571C15.2251 10.7805 15.3081 10.6159 15.4193 10.4727C15.5305 10.3296 15.6677 10.2107 15.8231 10.1229C15.9784 10.0351 16.1489 9.98002 16.3248 9.96094Z" fill="#6C6C6C" />
                            </svg>
                            <p>Children</p>
                            <div style={{ flexGrow: "1" }}></div>
                            <p
                                onClick={() => handlePreferenceClick({
                                    title: "Kids",
                                    type: "select",
                                    optionsApiEndpoint: "have_kids",
                                    saveApiEndpoint: "have_kids_id",
                                    element: "family"
                                })}
                            >{preferences?.have_kids ?? "Open to all"}</p>
                        </div>
                        <div className={styles.option}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="18" cy="18" r="18" fill="#F7ECFF" />
                                <g clip-path="url(#clip0_778_16240)">
                                    <path d="M16.0797 12.9692C16.0047 12.9317 15.9297 12.9317 15.8547 12.9317C15.5922 12.9317 15.3297 13.0817 15.2172 13.3817C15.1422 13.5317 15.1422 13.7192 15.2172 13.9067C15.2922 14.0567 15.4422 14.2067 15.5922 14.2442C15.7422 14.3192 15.9297 14.3192 16.1172 14.2442C16.2672 14.1692 16.4172 14.0192 16.4922 13.8692C16.6047 13.4567 16.4172 13.0817 16.0797 12.9692ZM20.2047 13.2317C20.1297 13.1942 20.0547 13.1942 19.9797 13.1942C19.8672 13.1942 19.7922 13.2317 19.7172 13.2692C19.5672 13.3442 19.4172 13.4942 19.3797 13.6442C19.2672 13.9817 19.4172 14.3567 19.7922 14.5067C20.1297 14.6192 20.5047 14.4692 20.6547 14.0942C20.7297 13.9067 20.7297 13.7567 20.6547 13.5692C20.5047 13.4192 20.3547 13.3067 20.2047 13.2317ZM18.3672 15.4067C18.2547 15.4067 18.1797 15.4442 18.1047 15.5192C17.8797 15.7817 17.6172 15.8942 17.2047 15.5567C17.0547 15.4442 16.8297 15.4817 16.6797 15.6317C16.5672 15.7817 16.6047 16.0067 16.7547 16.1567C17.4297 16.6817 18.1047 16.6067 18.6297 16.0067C18.7797 15.8567 18.7422 15.6317 18.5922 15.4817C18.5172 15.4442 18.4422 15.4067 18.3672 15.4067Z" fill="#6C6C6C" />
                                    <path d="M11.1656 8.28231L11.4281 10.1948L11.4281 10.2698L12.2156 12.6698C12.1031 12.9323 12.1406 13.2323 12.2531 13.4948C12.3656 13.7573 12.5906 13.9448 12.8531 14.0573C12.9281 15.6323 13.8281 17.0573 15.2156 17.9198C15.1781 19.6073 14.8781 20.8823 14.4281 21.5198L14.4281 21.5573C14.4281 21.5573 14.4281 21.5948 14.3906 21.5948L12.5531 25.4948C12.4781 25.6823 12.5531 25.8698 12.7031 25.9448L11.5031 28.1948C11.4281 28.3823 11.3906 28.5698 11.3906 28.7198C11.3906 29.2073 11.6906 29.6573 12.1406 29.8823C12.4406 30.0323 12.7781 30.0323 13.1156 29.9198C13.4531 29.8073 13.6781 29.5823 13.8281 29.2823L15.0281 27.0323C15.1406 27.0698 15.2906 26.9948 15.3656 26.9198C15.7031 26.5073 16.1906 26.0948 16.8656 25.6448C17.6906 25.1198 18.7406 25.1573 19.4906 25.7573C20.2031 26.3198 20.9156 26.9573 20.9156 26.9573C20.9906 27.0323 21.1406 27.0698 21.2531 27.0323L22.4531 29.2448C22.6031 29.5448 22.8656 29.8073 23.1656 29.9198C23.5031 30.0323 23.8406 30.0323 24.1406 29.8823C24.5906 29.6573 24.8906 29.2073 24.8906 28.7198C24.8906 28.5323 24.8531 28.3448 24.7781 28.1573L23.5781 25.9448C23.6156 25.9073 23.6906 25.8323 23.6906 25.7948C23.7281 25.7198 23.7281 25.6073 23.6906 25.5323L21.7406 21.5948C21.7406 21.5948 21.0281 19.9073 20.9531 17.8073C21.6281 17.3198 22.1531 16.6073 22.4531 15.8198C22.5281 15.6323 22.6406 15.2948 22.7156 14.9948C23.0531 14.9198 23.3531 14.6573 23.5031 14.3198C23.5781 14.1698 23.5781 14.0198 23.5781 13.8698C23.6156 13.8698 23.6156 13.8323 23.6531 13.8323C23.7281 13.7573 23.8031 13.6448 23.8031 13.5323C23.8031 13.4948 23.8031 13.1573 23.7281 12.7448L23.7281 12.7073L24.5156 10.3073L24.5156 10.2323L24.8156 8.31981C25.0031 7.71981 24.7031 7.04481 24.0656 6.81981C23.9156 6.78231 23.8031 6.74481 23.6531 6.74481C23.3531 6.74481 23.0156 6.85731 22.7906 7.08231C22.6781 7.19481 22.5656 7.34481 22.4906 7.53231L22.4906 7.60731L22.1906 9.44481C20.7656 7.56981 18.1031 6.14481 17.9906 6.06981C17.9906 5.99481 17.9156 5.99481 17.8406 5.99481C17.7281 5.99481 17.6531 6.03231 17.5781 6.10731C17.4656 6.21981 15.0281 8.69481 13.9031 10.0448L13.7531 9.55731L13.4531 7.60731L13.4531 7.53231C13.3781 7.34481 13.3031 7.19481 13.1531 7.08231C12.9281 6.85731 12.6281 6.74481 12.2906 6.74481C12.1406 6.74481 12.0281 6.78231 11.8781 6.81981C11.5781 6.93231 11.3156 7.15731 11.2031 7.45731C11.0906 7.68231 11.0531 8.01981 11.1656 8.28231ZM13.1531 28.9448C13.0781 29.0948 12.9656 29.1698 12.8531 29.2448C12.7031 29.2823 12.5531 29.2823 12.4406 29.2448C12.2531 29.1698 12.1031 28.9448 12.1031 28.7573C12.1031 28.6823 12.1031 28.6073 12.1406 28.5323L13.3406 26.2823L13.7906 26.5073L14.3156 26.7698L13.1531 28.9448ZM24.1406 28.7198C24.1406 28.9448 24.0281 29.1323 23.8031 29.2073C23.7656 29.2448 23.6906 29.2823 23.6156 29.2823C23.5406 29.2823 23.5031 29.2823 23.4281 29.2448C23.2781 29.2073 23.1656 29.0948 23.0906 28.9448L21.8906 26.7323L22.9031 26.2448L24.1031 28.4948C24.1406 28.5698 24.1406 28.6448 24.1406 28.7198ZM22.6781 25.5698L21.2531 26.2448L21.2156 26.2448C20.9531 26.0198 20.4656 25.5698 19.9406 25.1573C18.9281 24.3323 17.5406 24.2948 16.4531 25.0073C15.8531 25.4198 15.3281 25.8323 14.9906 26.2073L13.3781 25.4573L14.9531 22.1198L21.1781 22.0823L22.8656 25.4948L22.6781 25.5698ZM20.9156 21.3698L15.3656 21.3698C15.7406 20.5073 15.8906 19.3448 15.9656 18.2948L16.1906 18.4073L16.2281 18.4073C16.7156 18.5948 17.2031 18.6698 17.6906 18.7073C18.6281 18.7823 19.4906 18.5573 20.2406 18.1823C20.3531 19.6073 20.6906 20.7323 20.9156 21.3698ZM22.8281 13.9823C22.7531 14.1323 22.6031 14.2448 22.4156 14.2448C22.2281 14.2448 22.0781 14.3573 22.0406 14.5448C22.0031 14.7698 21.8906 15.2198 21.7781 15.5198C21.1781 17.1323 19.5281 18.1073 17.7281 17.9948C17.2781 17.9573 16.8656 17.8823 16.4531 17.7323C16.4156 17.7323 16.4156 17.7323 16.3781 17.6948C14.6906 17.0573 13.5281 15.4823 13.5281 13.7948C13.5281 13.6073 13.3781 13.4573 13.1906 13.4198C13.1906 13.4198 13.1531 13.4198 13.1156 13.3823C12.9281 13.3073 12.8156 13.0823 12.8906 12.8948L12.8906 12.8198C12.9281 12.7823 12.9281 12.7448 12.9656 12.7448C13.0031 12.7073 13.0781 12.6698 13.1531 12.6323L13.2281 12.6323C13.3406 12.6323 13.4906 12.6323 13.7156 12.5948L13.7531 12.5948C13.8656 12.5573 14.0156 12.5198 14.1656 12.4823C14.2406 12.4448 14.3156 12.4448 14.4281 12.4073L14.4656 12.4073C14.5781 12.3698 14.6531 12.3323 14.7656 12.2948C15.2156 12.1073 15.7031 11.8073 16.3406 11.3948L16.3781 11.3573C16.5656 11.4698 16.8656 11.6573 17.2031 11.8448C17.3156 11.9198 17.4656 11.9573 17.5781 12.0323L17.6156 12.0323C17.7281 12.0698 17.8781 12.1448 18.0281 12.1823L18.0656 12.1823L18.5156 12.2948L18.5906 12.2948C18.7406 12.3323 18.9281 12.3698 19.0781 12.3698C19.2656 12.4073 19.4156 12.4073 19.6031 12.4073L20.0906 12.4073C20.1656 12.4073 20.2031 12.4073 20.2781 12.3698C20.3531 12.3698 20.3906 12.3698 20.4656 12.3323C20.5406 12.3323 20.6156 12.2948 20.6531 12.2948C20.7281 12.2948 20.7656 12.2573 20.8406 12.2573C20.9156 12.2573 20.9906 12.2198 21.0281 12.2198C21.1406 12.3698 21.2906 12.5948 21.5156 12.7823C21.7406 13.0073 22.0406 13.2323 22.3781 13.4198C22.3781 13.4198 22.4156 13.4198 22.4156 13.4573L22.4531 13.4573C22.8281 13.6448 22.9031 13.8323 22.8281 13.9823ZM22.9031 9.74481L22.9031 9.66981L23.2406 7.71981C23.2781 7.64481 23.2781 7.60731 23.3531 7.56981C23.4656 7.45731 23.6906 7.38231 23.8406 7.45731C24.1031 7.53231 24.2156 7.83231 24.1406 8.05731L24.1406 8.13231L23.8406 10.0448L23.3906 11.3573C23.3531 11.2448 23.3156 11.1323 23.2406 11.0198C23.2406 10.9823 23.2031 10.9448 23.2031 10.9448L23.2031 10.9073C23.2031 10.8698 23.1656 10.8698 23.1656 10.8323L23.1656 10.7948C23.0906 10.6448 22.9781 10.4948 22.9031 10.3823C22.8656 10.3073 22.8281 10.2698 22.7906 10.1948L22.9031 9.74481ZM17.9156 6.81981C18.6656 7.26981 21.1031 8.76981 22.0406 10.4573C22.0781 10.5698 22.1906 10.6823 22.2656 10.7948C22.3406 10.9073 22.4531 11.0573 22.4906 11.1698C22.4906 11.2073 22.5281 11.2073 22.5281 11.2448C22.6781 11.5073 22.7531 11.7698 22.8281 12.0323C22.8281 12.0698 22.8281 12.1073 22.8656 12.1448C22.9031 12.2198 22.9031 12.2948 22.9406 12.3698C22.9406 12.4448 22.9781 12.5198 22.9781 12.5573L22.9781 12.8573L22.9406 12.8573C22.9406 12.8573 22.9031 12.8573 22.9031 12.8198C22.5656 12.6323 22.3031 12.4448 22.1156 12.2573C21.8156 11.9198 21.6656 11.6573 21.6656 11.6573C21.6281 11.5823 21.5531 11.5073 21.4781 11.4698C21.4031 11.4323 21.2906 11.4323 21.2156 11.4698C18.7406 12.3323 16.6781 10.6448 16.6781 10.6448C16.6406 10.6073 16.5656 10.5698 16.4906 10.5698L16.3406 10.5698C16.3031 10.5698 16.2656 10.6073 16.2656 10.6073C16.2281 10.6448 16.1906 10.6448 16.1531 10.6823C14.8781 11.5448 14.0531 11.8073 13.6406 11.8823C13.6781 11.7698 13.7156 11.6198 13.7531 11.5073C13.8281 11.3198 13.9406 11.1323 14.0531 10.9448C14.6156 10.1948 17.2031 7.56981 17.9156 6.81981ZM11.8781 7.71981C11.9156 7.60731 12.0281 7.53231 12.1406 7.45731C12.3281 7.38231 12.5156 7.41981 12.6656 7.56981C12.7031 7.60731 12.7406 7.64481 12.7781 7.71981L13.0781 9.66981L13.0781 9.74481L13.4156 10.7573C13.3781 10.7948 13.3781 10.8323 13.3406 10.9073C13.3406 10.9448 13.3031 10.9823 13.3031 11.0198C13.2656 11.1323 13.1906 11.2448 13.1531 11.3198L13.0406 11.6573C13.0406 11.6948 13.0406 11.7323 13.0031 11.7323C12.9656 11.8073 12.9656 11.9198 12.9656 11.9948L12.9656 12.0323L12.9281 12.0323C12.8906 12.0323 12.8531 12.0698 12.8531 12.0698L12.1781 10.0823L11.8781 8.16981L11.8781 8.09481C11.8031 7.98231 11.8031 7.83231 11.8781 7.71981Z" fill="#6C6C6C" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_778_16240">
                                        <rect width="24" height="24" fill="white" transform="translate(6 6)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <p>Family Plans</p>
                            <div style={{ flexGrow: "1" }}></div>
                            <p
                                onClick={() => handlePreferenceClick({
                                    title: "Family",
                                    type: "select",
                                    optionsApiEndpoint: "want_kids",
                                    saveApiEndpoint: "want_kids_id",
                                    element: "children"
                                })}
                            >{preferences?.want_kids ?? "Open to all"}</p>
                        </div>
                        
                        <div className={styles.option}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="18" cy="18" r="18" fill="#F7ECFF" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M24.5 11.5C24.5 11.2239 24.7239 11 25 11C26.3807 11 27.5 12.1193 27.5 13.5V14.2955C27.5 14.9895 27.1793 15.6086 26.6779 16.0127C27.4756 16.5519 28 17.4647 28 18.5V20C28 20.2761 27.7761 20.5 27.5 20.5C27.2239 20.5 27 20.2761 27 20V18.5C27 17.3955 26.1045 16.5 25 16.5C24.7239 16.5 24.5 16.2761 24.5 16C24.5 15.7239 24.7239 15.5 25 15.5H25.2955C25.9607 15.5 26.5 14.9607 26.5 14.2955V13.5C26.5 12.6716 25.8284 12 25 12C24.7239 12 24.5 11.7761 24.5 11.5ZM23 14.5C22.1715 14.5 21.5 15.1715 21.5 16V16.9091C21.5 17.7375 22.1715 18.4091 23 18.4091H24.5C25.3284 18.4091 26 19.0806 26 19.9091V20C26 20.2761 25.7761 20.5 25.5 20.5C25.2239 20.5 25 20.2761 25 20V19.9091C25 19.6329 24.7761 19.4091 24.5 19.4091H23C21.6193 19.4091 20.5 18.2898 20.5 16.9091V16C20.5 14.6193 21.6193 13.5 23 13.5C23.2761 13.5 23.5 13.7239 23.5 14C23.5 14.2761 23.2761 14.5 23 14.5ZM9.5 21C8.67158 21 8 21.6715 8 22.5V23.5C8 24.3285 8.67158 25 9.5 25H22.5C23.3285 25 24 24.3285 24 23.5V22.5C24 21.6715 23.3285 21 22.5 21H9.5ZM9 22.5C9 22.2239 9.22386 22 9.5 22H22.5C22.7761 22 23 22.2239 23 22.5V23.5C23 23.7761 22.7761 24 22.5 24H9.5C9.22386 24 9 23.7761 9 23.5V22.5ZM26 22C26 21.7239 25.7761 21.5 25.5 21.5C25.2239 21.5 25 21.7239 25 22V24C25 24.2761 25.2239 24.5 25.5 24.5C25.7761 24.5 26 24.2761 26 24V22ZM28 22C28 21.7239 27.7761 21.5 27.5 21.5C27.2239 21.5 27 21.7239 27 22V24C27 24.2761 27.2239 24.5 27.5 24.5C27.7761 24.5 28 24.2761 28 24V22Z" fill="#6C6C6C" />
                            </svg>
                            <p>Smoking</p>
                            <div style={{ flexGrow: "1" }}></div>
                            <p
                                onClick={() => handlePreferenceClick({
                                    title: "Smoking",
                                    type: "radio",
                                    optionsApiEndpoint: "smokes",
                                    saveApiEndpoint: "smoking_id",
                                    element: "smoking"
                                })}
                            >{preferences?.smoking ?? "Open to all"}</p>
                        </div>
                        <div className={styles.option}>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="18" cy="18" r="18" fill="#F7ECFF" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4773 8.25627C14.2252 8.27627 13.9798 8.34689 13.7557 8.4639C13.5317 8.58091 13.3335 8.74191 13.173 8.93727C12.9158 9.25227 12.789 9.63477 12.7688 10.027C12.5631 10.0011 12.3547 10.0067 12.1508 10.0435C11.8415 10.105 11.5507 10.2372 11.301 10.4298C11.0514 10.6229 10.8494 10.8708 10.7106 11.1542C10.5717 11.4377 10.4997 11.7491 10.5 12.0648L10.5045 12.73L10.503 12.7375V12.7908L10.5015 12.946L10.5 13.6825V14.2683C10.5 14.8083 10.803 15.2755 11.244 15.5298V25.2693C11.244 26.2218 12.0188 27.0018 12.9698 27.0018H20.7743C21.7253 27.0018 22.5 26.2218 22.5 25.2693V24.0168H24.1245C24.4882 24.017 24.8372 23.873 25.095 23.6165C25.3528 23.36 25.4984 23.0117 25.5 22.648V16.3713C25.4986 16.0074 25.3531 15.659 25.0952 15.4023C24.8374 15.1456 24.4883 15.0016 24.1245 15.0018H22.5V13.8723C22.869 13.5948 23.1375 13.186 23.2223 12.7023C23.2984 12.2589 23.2128 11.8029 22.9809 11.4173C22.7491 11.0317 22.3866 10.7422 21.9593 10.6015C21.8774 10.3446 21.737 10.1102 21.5492 9.91667C21.3614 9.72315 21.1313 9.57583 20.877 9.48627C20.5643 9.37994 20.2279 9.36459 19.9069 9.442C19.5858 9.51941 19.2934 9.68639 19.0635 9.92352C18.8829 9.67666 18.6538 9.46916 18.3904 9.31366C18.127 9.15816 17.8347 9.05791 17.5313 9.01902C17.0958 8.96599 16.6544 9.0416 16.2615 9.23652C16.132 8.99356 15.9503 8.78229 15.7295 8.61787C15.5086 8.45344 15.2541 8.33995 14.9843 8.28552C14.8174 8.25257 14.6468 8.24323 14.4773 8.25627ZM14.5358 9.00477C14.7675 8.98693 14.999 9.04187 15.198 9.16194C15.397 9.28201 15.5535 9.4612 15.6458 9.67452C15.5685 9.75242 15.497 9.83589 15.432 9.92427C15.4029 9.96411 15.382 10.0093 15.3704 10.0572C15.3588 10.1051 15.3568 10.1549 15.3644 10.2036C15.3798 10.302 15.4337 10.3902 15.5141 10.4489C15.5946 10.5076 15.6951 10.5319 15.7934 10.5165C15.8422 10.5089 15.8889 10.4917 15.931 10.466C15.9731 10.4403 16.0097 10.4066 16.0388 10.3668C16.196 10.1509 16.4081 9.98102 16.6531 9.8747C16.8981 9.76839 17.167 9.72951 17.4321 9.7621C17.6972 9.79468 17.9487 9.89755 18.1606 10.06C18.3726 10.2225 18.5372 10.4387 18.6375 10.6863C18.6366 10.7752 18.6673 10.8615 18.7242 10.9299C18.781 10.9982 18.8603 11.0442 18.9479 11.0595C19.0355 11.0748 19.1256 11.0585 19.2023 11.0135C19.279 10.9685 19.3372 10.8977 19.3665 10.8138C19.4082 10.6894 19.4742 10.5746 19.5606 10.476C19.647 10.3774 19.7522 10.297 19.87 10.2393C19.9878 10.1817 20.1158 10.148 20.2467 10.1403C20.3776 10.1326 20.5088 10.1509 20.6325 10.1943C21.1553 10.375 21.4305 10.9398 21.252 11.4693C21.2346 11.5163 21.2268 11.5663 21.2291 11.6164C21.2314 11.6665 21.2437 11.7156 21.2653 11.7608C21.2869 11.8061 21.3174 11.8465 21.3549 11.8798C21.3924 11.9131 21.4362 11.9385 21.4837 11.9545C21.5312 11.9706 21.5814 11.9769 21.6314 11.9732C21.6814 11.9695 21.7302 11.9559 21.7748 11.933C21.8194 11.9101 21.859 11.8785 21.8912 11.8401C21.9234 11.8017 21.9475 11.7572 21.9623 11.7093C21.9908 11.6253 22.0058 11.5398 22.0208 11.455C22.3703 11.6995 22.5608 12.127 22.4828 12.5718C22.4351 12.8495 22.2844 13.099 22.0609 13.2705C21.8373 13.4421 21.5573 13.523 21.2768 13.4973C20.9959 13.4735 20.7343 13.3449 20.5441 13.137C20.3538 12.929 20.2488 12.6571 20.25 12.3753C20.251 12.3041 20.2317 12.234 20.1943 12.1734C20.157 12.1128 20.1031 12.064 20.0391 12.0329C19.975 12.0017 19.9035 11.9894 19.8327 11.9975C19.7619 12.0055 19.6949 12.0335 19.6395 12.0783C19.4724 12.0289 19.2992 12.0032 19.125 12.0018C18.6277 12.0026 18.151 12.2006 17.7995 12.5524C17.448 12.9041 17.2504 13.381 17.25 13.8783C17.2497 13.9073 17.2527 13.9362 17.259 13.9645C17.2528 13.9921 17.2498 14.0203 17.25 14.0485V15.781C17.25 16.1815 16.9275 16.5018 16.5 16.5018C16.0725 16.5018 15.75 16.1815 15.75 15.7818V13.8888C15.75 13.0765 15.0713 12.4188 14.2545 12.4188H14.2455C13.428 12.4188 12.75 13.0743 12.75 13.8873V14.0485C12.7487 14.0577 12.7477 14.067 12.747 14.0763L12.7425 14.2608C12.7425 14.2635 12.7425 14.2663 12.7425 14.269C12.7425 14.665 12.4193 14.986 11.9985 14.986H11.994C11.8984 14.9914 11.8027 14.9773 11.7128 14.9445C11.6229 14.9116 11.5406 14.8608 11.4709 14.7951C11.4013 14.7294 11.3458 14.6502 11.3078 14.5623C11.2698 14.4745 11.2502 14.3798 11.25 14.284V13.7388H11.2545V12.7968L11.25 12.0648C11.25 11.656 11.4383 11.2713 11.76 11.023C12.0803 10.7755 12.4935 10.6938 12.8835 10.798C12.888 10.8108 12.888 10.8243 12.8933 10.837C12.9315 10.9289 13.0048 11.0018 13.0968 11.0397C13.1889 11.0777 13.2922 11.0774 13.3841 11.0391C13.476 11.0009 13.5489 10.9276 13.5869 10.8356C13.6248 10.7435 13.6245 10.6402 13.5863 10.5483C13.5082 10.3616 13.4825 10.1571 13.512 9.95691C13.5415 9.7567 13.625 9.56832 13.7535 9.41202C13.95 9.17202 14.2335 9.02802 14.5358 9.00477ZM19.125 12.7518C19.2773 12.7518 19.4273 12.7923 19.5705 12.8545C19.6685 13.2264 19.8784 13.5591 20.1718 13.8077C20.4652 14.0563 20.8279 14.2087 21.2108 14.2443C21.396 14.2608 21.5753 14.2413 21.75 14.2045V25.2693C21.75 25.822 21.3203 26.2525 20.775 26.2525H12.969C12.423 26.2525 11.994 25.822 11.994 25.27V15.7353H11.9978C12.8138 15.7353 13.4918 15.0798 13.4918 14.2683L13.4948 14.1333C13.4982 14.1129 13.4999 14.0924 13.5 14.0718V13.8873C13.5 13.4905 13.824 13.1673 14.2455 13.1673H14.2545C14.676 13.1673 15 13.4905 15 13.8873V15.781C15 16.5948 15.6803 17.2518 16.5 17.2518C17.3198 17.2518 18 16.5948 18 15.7818V14.0485C18.0004 14.0193 17.9974 13.9901 17.991 13.9615C17.9971 13.9342 18.0001 13.9063 18 13.8783C17.9998 13.7304 18.0288 13.584 18.0852 13.4473C18.1417 13.3106 18.2245 13.1864 18.329 13.0818C18.4335 12.9772 18.5575 12.8942 18.6941 12.8375C18.8307 12.7809 18.9771 12.7518 19.125 12.7518ZM22.5 15.7518H24.1245C24.4995 15.7518 24.75 16.0023 24.75 16.3713V22.6488C24.75 23.017 24.4995 23.2675 24.1245 23.2675H22.5V15.7518ZM13.869 17.5113C13.8198 17.5121 13.7711 17.5225 13.7259 17.5421C13.6807 17.5617 13.6398 17.59 13.6056 17.6253C13.5713 17.6607 13.5444 17.7025 13.5262 17.7483C13.5081 17.7941 13.4992 17.843 13.5 17.8923V24.5995C13.5 24.699 13.5395 24.7944 13.6098 24.8647C13.6802 24.935 13.7755 24.9745 13.875 24.9745C13.9745 24.9745 14.0698 24.935 14.1402 24.8647C14.2105 24.7944 14.25 24.699 14.25 24.5995V17.8923C14.2508 17.842 14.2415 17.7921 14.2227 17.7455C14.2038 17.6989 14.1758 17.6566 14.1402 17.6211C14.1047 17.5855 14.0623 17.5575 14.0158 17.5386C13.9692 17.5198 13.9193 17.5105 13.869 17.5113ZM16.869 17.5113C16.8198 17.5121 16.7711 17.5225 16.7259 17.5421C16.6807 17.5617 16.6398 17.59 16.6056 17.6253C16.5713 17.6607 16.5444 17.7025 16.5262 17.7483C16.5081 17.7941 16.4992 17.843 16.5 17.8923V24.5995C16.5 24.699 16.5395 24.7944 16.6098 24.8647C16.6802 24.935 16.7755 24.9745 16.875 24.9745C16.9745 24.9745 17.0698 24.935 17.1402 24.8647C17.2105 24.7944 17.25 24.699 17.25 24.5995V17.8923C17.2508 17.842 17.2415 17.7921 17.2227 17.7455C17.2038 17.6989 17.1758 17.6566 17.1402 17.6211C17.1047 17.5855 17.0623 17.5575 17.0158 17.5386C16.9692 17.5198 16.9193 17.5105 16.869 17.5113ZM19.869 17.5113C19.8198 17.5121 19.7711 17.5225 19.7259 17.5421C19.6807 17.5617 19.6398 17.59 19.6056 17.6253C19.5713 17.6607 19.5444 17.7025 19.5262 17.7483C19.5081 17.7941 19.4992 17.843 19.5 17.8923V24.5995C19.5 24.699 19.5395 24.7944 19.6098 24.8647C19.6802 24.935 19.7755 24.9745 19.875 24.9745C19.9745 24.9745 20.0698 24.935 20.1402 24.8647C20.2105 24.7944 20.25 24.699 20.25 24.5995V17.8923C20.2508 17.842 20.2415 17.7921 20.2227 17.7455C20.2038 17.6989 20.1758 17.6566 20.1402 17.6211C20.1047 17.5855 20.0623 17.5575 20.0158 17.5386C19.9692 17.5198 19.9193 17.5105 19.869 17.5113Z" fill="#6C6C6C" />
                            </svg>
                            <p>Drinking</p>
                            <div style={{ flexGrow: "1" }}></div>
                            <p
                                onClick={() => handlePreferenceClick({
                                    title: "Drinking",
                                    type: "radio",
                                    optionsApiEndpoint: "drinks",
                                    saveApiEndpoint: "drinks_id",
                                    element: "drinking"
                                })}
                            >{preferences?.drinking ?? "Open to all"}</p>
                        </div>
                    </div>
                    <Button
                        style={{
                            borderRadius: "9999px",
                            width: "15rem",
                            marginBottom: "2rem",
                        }}
                        onClick={() => (window.location.href = "/user/home")}
                    >Apply</Button>
                </div>
            </div>
        </Sidebar>
    )
}


const LocationModal = ({ show, setShow, locationId, setRefresh_, refresh_ }) => {
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedPreferenceOptions, setSelectedPreferenceOptions] = useState({});
    const [loading, setLoading] = useState(false);
    const { setRefresh } = useUserProfile();
    const cookies = useCookies();
  
    // Fetch user preferences
    useEffect(() => {
      if (!show) return; // Fetch only when the modal is shown
      setLoading(true);
      (async () => {
        try {
          const response = await fetch(`${API_URL}customer/user/preferences/options/locations`, {
            headers: {
              Authorization: `Bearer ${cookies.getCookie('token')}`,
            },
          });
  
          if (!response.ok) {
            console.error("Failed to fetch preferences locations");
            setLoading(false);
            return;
          }
  
          const data = await response.json();
          if (!data || Object.keys(data).length === 0) {
            console.log("No location data available.");
            setLoading(false);
            return;
          }
  
          setSelectedPreferenceOptions(data);
          if (!locationId) {
            setSelectedCountry(""); // Default to "All Country" if no locationId
            setSelectedCity(""); // No city selected initially
          } else {
            // Set default country and city when locationId is available
            const val = Object.keys(data)
              .map((option) => data[option])
              .flat()
              .find((option) => option.id === locationId);
            setSelectedCountry(val?.country || "");
            setSelectedCity(val?.id || "");
          }
          setLoading(false);
          console.log("Preferences fetched successfully");
        } catch (error) {
          console.error("Error fetching preferences:", error);
          setLoading(false);
        }
      })();
    }, [show, locationId]); // Fetch preferences when modal is shown or locationId changes
  
    // Handle change in country selection
    const handleCountryChange = (country) => {
      setSelectedCountry(country);
      if (country && selectedPreferenceOptions[country]?.length > 0) {
        // Automatically select the first city in the selected country
        setSelectedCity(selectedPreferenceOptions[country][0].id);
      } else {
        setSelectedCity(""); // Reset city if no country or no cities available
      }
    };
    
    // Determine location ID and type based on selections
    const getLocationData = () => {
      if (!selectedCountry) {
        return { location_id: "", type: 0 }; // 'All Country' selected
      }
      if (selectedCity) {
        return { location_id: selectedCity, type: 2 }; // City selected
      }
      if (selectedCountry) {
        return { location_id: selectedPreferenceOptions[selectedCountry][0]?.id, type: 1 }; // Country selected, use first city id
      }
      return { location_id: "", type: 0 };
    };
  
    async function handlePreferenceSave(e) {
      e.preventDefault();
    
      const { location_id, type } = getLocationData();
  
      const bodyContent = {
        location_id,
        type,
      };
  
      try {
        const response = await fetch(`${API_URL}customer/user/preferences/save/location`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.getCookie("token")}`,
          },
          body: JSON.stringify(bodyContent),
        });
  
        if (response.ok) {
          setShow(false);
          setRefresh_(!refresh_);
          cookies.deleteCookie("wave");
          setRefresh((prev) => prev + 1);
          console.log("Preference saved successfully");
        } else {
          console.error("Failed to save preferences");
        }
      } catch (error) {
        console.error("Error saving preferences:", error);
      }
    }
  
    return (
      <Modal  show={show}  className={styles.modalbody}>
        <Modal.Body  >
        
        
        <label htmlFor="all-country" className={styles.locationRadio} style={{
            marginBottom : "15px"
        }}>
          <p>Open to all</p>
          <input
            type="radio"
            id="all-country"
            name="country-option"
            checked={!selectedCountry}
            onChange={() => handleCountryChange("")}
          />
        </label>
  
        {selectedPreferenceOptions && (
          <>
            <Select
              style={{ width: "100%", textAlign: "start" , marginBottom : "15px" }}
              value={selectedCountry || ""}
              onChange={(e) => handleCountryChange(e.target.value)}
              displayEmpty
              placeholder="Select a country"
              MenuProps={{
                PaperProps: {
                  style: {
                    width: "9rem",
                    height: "12rem",
                    marginBottom : "15px"
                  },
                },
              }}
            >
              <MenuItem value="" disabled>
                Select a country
              </MenuItem>
              {Object.keys(selectedPreferenceOptions)?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {selectedCountry && (
              <Select
                style={{ width: "100%", textAlign: "start" }}
                value={selectedCity || ""}
                displayEmpty
                onChange={(e) => setSelectedCity(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      width: "9rem",
                      height: "12rem",
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Select a city
                </MenuItem>
                {selectedPreferenceOptions[selectedCountry]
      ?.filter((option) => option.location_string !== null) // Filter out options where id is null
      .map((option) => (
        <MenuItem key={option.id} value={option.id}>
          {option.location_string}
        </MenuItem>
      ))}
              </Select>
            )}
          </>
        )}
  
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "1rem",
            marginInline: "auto",
          }}
        >
          <button
            type="button"
            className="global-cancel-button"
            onClick={() => {
              setShow(false);
              setSelectedCity("");
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="global-save-button"
            onClick={handlePreferenceSave}
          >
            Save
          </button>
        </div>
         </Modal.Body>
      </Modal>
    );
  };
  
  
  
  