import Divider from "@/components/base/Divider";
import Link from "next/link";

export const privacyPolicyLastUpdate = "1/31/2026";

export default function PrivacyPolicyPage() {
    return (
        <div className="mx-auto w-1/2 bg-bg-light p-10">
            <h1>Privacy Policy</h1>
            <p>Last Updated: {privacyPolicyLastUpdate}</p>

            <h2>Data We Collect</h2>
            <Divider />

            <p>Some data is collected and stored in a database to keep track of everything you create.</p>

            <ul>
                <li>Account data, such as your name, email, and profile picture, collected from the login method you choose.</li>
                <li>All your filament, storage, prints, or settings you create/modify and all of their relevent data.</li>
            </ul>

            <p>None of this data will ever be shared with any third parties, unless requested by law or authorities.</p>
            <p>This data is retained for as long as you hold an account on Filatrack.</p>

            <p>Additionally, the privacy policies and terms of service of the following login methods also apply, if used to login:</p>
            <ul>
                <li>Google</li>
                <li>GitHub</li>
            </ul>

            <h2>Deleting your Data</h2>
            <Divider />

            <p>
                To delete all of your Filatrack data, please visit settings and press "Delete Account", and follow the steps.
                Once you have deleted your account, none of your data will remain in our database. This action cannot be undone.
            </p>

            <h2>Cookies</h2>
            <Divider />

            <p>
                The only cookies we store are necessary to Filatrack's function.
                They store authentication information when you login and to keep you logged in.
            </p>

            <h2>Analytics</h2>
            <Divider />

            <p>
                Filatrack collects completely anonymous, optional analytics to provide the best experience to end users.
                You may turn off these analytics in the settings page.
            </p>

            <p>Data collected includes:</p>
            <ul>
                <li>Browser</li>
                <li>Device Information, such as type of device (mobile/pc), OS, and screen dimensions</li>
                <li>Pages viewed</li>
                <li>Links clicked</li>
                <li>Referrer (the page that directed you to Filatrack)</li>
                <li>Country/Region</li>
                <li>Actions in Filatrack (creating filament/prints, etc.)</li>
                <li>Sessions</li>
            </ul>

            <p>
                None of this data will ever be shared or linked back to you.
                We encourage users who want complete privacy to turn off analytics.
            </p>

            <h2>Changes to this Privacy Policy</h2>
            <Divider />

            <p>
                Should anything be changed in this privacy policy, the date at the top of this document will be updated and
                you will be notified through a toast on Filatrack the next time you visit it. Any changes made to the privacy
                policy are effective immediately on/after the Last Updated date in Mountain Standard Time.
            </p>

            <h2>Children's Privacy</h2>
            <Divider />

            <p>
                We do not knowingly collect data of any user under 13 years of age. Users under 13 should have an account managed
                by a parent. Otherwise, they should not have an account with us or delete their account until they are over 13.
                We will take the necessary steps to delete accounts that we are made aware of that are owned by children under 13
                that have not received parental consent.
            </p>

            <h2>Contact Us</h2>
            <Divider />

            <p>Please don't hesitate to contact us if you have any questions, issues, or requests about the privacy policy.</p>

            <p>You can reach us via the following:</p>
            <ul>
                <li>Fill out this form: <Link href="/about/contact">https://filatrack.app/about/contact</Link></li>
                <li>Visit our Discord server: <Link href="/discord">https://filatrack.app/discord</Link></li>
            </ul>
        </div>
    );
}
