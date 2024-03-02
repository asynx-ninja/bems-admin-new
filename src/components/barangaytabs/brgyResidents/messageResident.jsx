import React from "react";
import axios from "axios";
import API_LINK from "../../../config/API";
import StatusLoader from "./loaders/StatusLoader";
import { useState } from "react";
import GetBrgy from "../../GETBrgy/getbrgy";

function StatusResident({ user, setUser, brgy, status, setStatus }) {
    const information = GetBrgy(brgy);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [error, setError] = useState(null);
    const [sendMessage, setSendMessage] = useState();
    const [banner, setBanner] = useState({
        link: "https://drive.google.com/file/d/1RqjWYc2RilU54XlQejedZ_apmjDQbcP8/view?usp=sharing",
        name: "resident_logo.jpg",
        id: "1RqjWYc2RilU54XlQejedZ_apmjDQbcP8",
    });

    const [logo, setLogo] = useState({
        link: "https://drive.google.com/file/d/1RqjWYc2RilU54XlQejedZ_apmjDQbcP8/view?usp=sharing",
        name: "resident_logo.png",
        id: "1RqjWYc2RilU54XlQejedZ_apmjDQbcP8",
    });

    const handleSave = async (e) => {
        try {
           
            const messageContent = document.getElementById("message").value;

           
            const notificationData = {
                category: "One",
                compose: {
                    subject: "AYOKO NA", 
                    message: messageContent, 
                    go_to: null,
                },
                target: {
                    user_id: user.user_id, 
                    area: brgy,
                },
                type: "Resident",
                banner: banner,
                logo: logo,
            };

            const response = await axios.post(`${API_LINK}/notification/`, notificationData);
            console.log(response.data); 
            setUpdatingStatus("success");
            setTimeout(() => {
                window.location.reload();
              }, 3000);
            document.getElementById("message").value = "";
        } catch (err) {
            console.error(err);
            setUpdatingStatus("error");
            setError("An error occurred while sending the message.");
        } finally {
            setSubmitClicked(false);
        }
    };


    const handleOnChange = (e) => {
        setStatus((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };


    const handleClose = () => {
        window.location.reload();
    };

    return (
        <div>
            <div className="">
                <div
                    id="hs-modal-messageResident"
                    className="hs-overlay hidden fixed top-0 left-0 z-[60] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center"
                >
                    {/* Modal */}
                    <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-xl">
                        <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto">
                            {/* Header */}
                            <div
                                className="py-5 px-3 flex justify-between items-center overflow-hidden rounded-t-2xl"
                                style={{
                                    background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
                                }}
                            >
                                <h3
                                    className="font-bold text-white mx-auto md:text-xl text-center"
                                    style={{ letterSpacing: "0.3em" }}
                                >
                                    MESSAGE
                                </h3>
                            </div>

                            <div className="mt-5">
                                <form>
                                    <div className="flex justify-center flex-col lg:flex-row px-7">
                                        <div className="w-5/6 flex flex-col">
                                            <h1> SEND TO: {user.firstName} </h1>
                                            <h1 className="font-bold mb-2 text-xl">
                                                SEND MESSAGE:
                                            </h1>
                                            <textarea name="message" id="message" cols="30" rows="10" className="border-2 w-full">

                                            </textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            {/* Buttons */}
                            <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700 mx-auto">
                                <div className="sm:space-x-0 md:space-x-2 sm:space-y-2 md:space-y-0 w-full flex sm:flex-col md:flex-row">
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        className="h-[2.5rem] w-full md:w-[9.5rem] py-1 px-6 inline-flex justify-center items-center gap-2 rounded-md borde text-sm font-base bg-teal-900 text-white shadow-sm align-middle"
                                    >
                                        SEND MAIL
                                    </button>
                                    <button
                                        type="button"
                                        className="h-[2.5rem] w-full md:w-[9.5rem] py-1 px-6 inline-flex justify-center items-center gap-2 rounded-md border text-sm font-base bg-pink-800 text-white shadow-sm align-middle"
                                        data-hs-overlay="#hs-modal-messageResident"
                                        // onClick={handleClose}
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {submitClicked && <StatusLoader updatingStatus="updating" />}
                    {updatingStatus && (
                        <StatusLoader updatingStatus={updatingStatus} error={error} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default StatusResident;
