import Divider from "@/components/base/Divider";
import Link from "next/link";

export const privacyPolicyLastUpdate = new Date("April 4, 2026 00:00:00 GMT-0600");

export default function PrivacyPolicyPage() {
    return (
        <div className="mx-auto w-1/2 bg-bg-light p-10 *:[h2]:mt-2 [&_p]:mb-2 [&_ul]:mb-2">
            <h1>Privacy Policy</h1>
            <p>Last Updated: {privacyPolicyLastUpdate.toLocaleString(undefined, { timeZone: "America/Denver" })} MST</p>

            <Divider />

            <h2>Introduction</h2>
            <Divider />

            <p>
                Filatrack is designed with good intention and only uses your data for the purposes of the website. We take your privacy
                very seriously, and we only collect data necessary to Filatrack's functions.
            </p>
            <p>
                When you make an account with Filatrack, you consent to the contents of this Privacy Policy.
            </p>

            <h2>Data We Collect</h2>
            <Divider />

            <p>Accounts, filament, prints, boxes, etc. you create are all stored in a database. This data includes:</p>

            <ul>
                <li>
                    Account data, such as your name, email, and profile picture,
                    provided from the login method you chose when signing up.
                </li>
                <li>All your filament, storage, prints, or settings you create/modify and all of their relevent data.</li>
                <li>Any settings shown under the settings page.</li>
            </ul>

            <p>This data is retained for as long as you hold an account on Filatrack. See the Deleting your Data section below.</p>

            <p>
                Filatrack seperately collects completely anonymous, optional analytics to track trends and improve the platform.
                You may turn off these analytics in the settings page.
            </p>

            <p>Anonymous, analytical data collected includes:</p>
            <ul>
                <li>Browser (Chrome, Firefox, etc.)</li>
                <li>Device Information, such as type of device (mobile/PC), operating system, and screen dimensions</li>
                <li>Pages viewed</li>
                <li>Links clicked</li>
                <li>Referrer (the page that directed you to Filatrack)</li>
                <li>Country/Region</li>
                <li>Actions in Filatrack (creating filament/prints/storages, etc.)</li>
            </ul>

            <p>
                None of this analytical data will ever be shared or linked back to you.
                We encourage users who want complete privacy to turn off analytics in the settings page.
            </p>

            <p>
                None of the data stated in this section will ever be shared with any third parties,
                unless requested by law enforcement or authorities.
            </p>

            <p>Additionally, the privacy policies and terms of service of the following login methods also apply, if used to login:</p>
            <ul>
                <li>Google</li>
                <li>GitHub</li>
            </ul>

            <h2>GDPR Compliance</h2>
            <Divider />

            <p>
                Filatrack's legal basis for collecting and storing your user data is to provide you with the basic services
                that Filatrack provides, which you give permission to do so as you sign up.
            </p>

            <p>
                If you are a resident of the European Economic Area (EEA), you have the following rights, as stated by the
                GDPR (General Data Protection Regulation):
            </p>
            <ul>
                <li>The right to access, update or to delete your information we store</li>
                <li>The right of rectification</li>
                <li>The right to object</li>
                <li>The right of restriction</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
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

            <h2>Children's Privacy</h2>
            <Divider />

            <p>
                We do not knowingly collect data of any user under 13 years of age, nor do we collect age data to check if a user
                is under 13.
                Users under 13 should have an account managed by a parent.
                Otherwise, they should not have an account with us or delete their account until they are over 13.
                We will take the necessary steps to delete accounts that we are made aware of that are owned by children under 13
                that have not received parental consent.
            </p>

            <h2>Changes to this Privacy Policy</h2>
            <Divider />

            <p>
                Should anything be changed in this privacy policy, the date at the top of this document will be updated and
                you will be notified through a toast on Filatrack the next time you visit it. Any changes made to the privacy
                policy are effective immediately on/after the Last Updated date at 12:00am in Mountain Standard Time.
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
