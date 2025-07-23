import { Request, Response } from "express";
import axios from "axios";
import { getUuId } from "../utils/uuid";

const ONESIGNAL_REST_API_KEY = 'os_v2_app_vbzz6thjcbeqhjdg2mwejj7n5ametp2rycbedquywraandpzhmfoe6ducagrili5r7jdi3wig4e3jbjljnfkfr2x76ntguxpijgoerq'
const ONESIGNAL_APP_ID = 'a8739f4c-e910-4903-a466-d32c44a7ede8'

export const sendPushNoti = async(req: Request,res: Response) => {
    try {
        const { onesignal_id } = req.body;
        
        const response = await axios.post(
            'https://api.onesignal.com/notifications?c=push',
            {
                app_id: ONESIGNAL_APP_ID,
                include_player_ids: [onesignal_id],
                headings: { en: 'Chacha OP!!' },
                contents: { en: 'ky ky mc' },
                isAndroid: true,
                small_icon: "ic_stat_notification",
                android_channel_id: "high_priority_notifications",
            },
            {
                headers: {
                    Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("OneSignal Success:", response.data);
        const externalId = getUuId();
        res.status(200).json({
            msg: 'Notification sent',
            externalId
        });
    } catch (error: any) {
        console.error('OneSignal API Error:', error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            msg: 'Failed to send notification',
            error: error.response?.data || 'Internal server error',
        });
    }
}