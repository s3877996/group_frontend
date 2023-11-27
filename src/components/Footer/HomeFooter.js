import React from 'react'
import FooterItem from "./FooterItem";
import Facebook from "../../image/Facebook.png";
import Twitter from "../../image/Twitter.png";
import Insta from "../../image/Instagram.png";
import Tiktok from "../../image/TikTok.png";
import { useNavigate } from "react-router-dom";

const HomeFooter = () => {
    const navigate = useNavigate();
    return (
        <div className="p-4">
            <div className="h-[300px] bg-gray-200 p-[50px]">
                <div className="max-w-[1000px] w-full mx-auto">
                    <div className="flex items-start text-black gap-x-[6rem] ">
                        <FooterItem
                            title="Get Grammarly"
                            items={["Windows", "Desktop", "Mac"]}></FooterItem>
                        <FooterItem
                            title="Learn More"
                            items={[
                                "Premium",
                                "Business",
                                "Education",
                            ]}></FooterItem>
                        <FooterItem
                            title="Features"
                            items={[
                                "Checker",
                                "Plagiarism",
                                "Ciatation",
                                "Tone Checker",
                            ]}>
                        </FooterItem>
                        <FooterItem
                            title="About Us"
                            items={[
                                "About",
                                "Partners",
                                "Policy",
                                "Help Center",
                            ]}>
                        </FooterItem>
                        <div>
                            <FooterItem
                                title="Contact"
                                items={[
                                    "Email: grammarly@gmail.com",
                                    "Phone number: 0988 123 456",
                                ]}></FooterItem>
                            <p className="mt-4 font-semibold">
                                Grammarly Social Contacts

                            </p>
                            <ul className="flex items-center mt-4 gap-x-4 md:gap-x-8">
                                <li>
                                    <img src={Facebook} alt="" />
                                </li>
                                <li>
                                    <img src={Twitter} alt="" />
                                </li>
                                <li>
                                    <img src={Insta} alt="" />
                                </li>
                                <li>
                                    <img src={Tiktok} alt="" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default HomeFooter;