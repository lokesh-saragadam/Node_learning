import ProfileHeader from "../components/ProfileHeader.jsx";
import ProfileSetup from "../components/ProfileSetup.jsx";

export default function ProfilePage(){

    return (
        <div className="home_page">
            <ProfileHeader/>
            <main>
                <ProfileSetup/>
            </main>
        </div>
    )
};