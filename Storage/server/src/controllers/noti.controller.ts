import { Request, Response } from "express";
import axios from "axios";
import { getUuId } from "../utils/uuid";

const ONESIGNAL_REST_API_KEY = 'os_v2_app_vbzz6thjcbeqhjdg2mwejj7n5ametp2rycbedquywraandpzhmfoe6ducagrili5r7jdi3wig4e3jbjljnfkfr2x76ntguxpijgoerq'
const ONESIGNAL_APP_ID = 'a8739f4c-e910-4903-a466-d32c44a7ede8'

export const sendPushNoti = async(req: Request,res: Response) => {
    try {
        const { onesignal_id } = req.body;
        console.log(onesignal_id);
        const response = await axios.post(
        'https://api.onesignal.com/notifications?c=push',
        {
            app_id: ONESIGNAL_APP_ID,
            include_player_ids: [onesignal_id],  // replace with real OneSignal ID
            headings: { en: 'Chacha OP!!' },
            contents: { en: 'ky ky mc' },
            isAndroid: true
        },
        {
            headers: {
                Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`, // from OneSignal dashboard
                'Content-Type': 'application/json'
            }
        }
    );
    console.log(response);
    const externalId = getUuId();
    res.status(200).json({
        msg: 'Notification sent',
        externalId
    });
    } catch (error: any) {
        console.error('Login error:', error);
        return res.status(error.status || 500).json({
            msg: error.message || 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
    }
}