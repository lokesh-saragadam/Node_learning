import ProfileHeader from "../components/ProfileHeader.jsx";
import ProfileSetup from "../components/ProfileSetup.jsx";

export default function ProfilePage(){

    return (
        <div className="ok">
            <ProfileHeader/>
            <main>
                <ProfileSetup/>
            </main>
        </div>
    )
};