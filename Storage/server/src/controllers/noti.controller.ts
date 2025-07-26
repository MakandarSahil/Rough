import { Request, Response } from 'express';
import axios from 'axios';

const ONESIGNAL_REST_API_KEY =
  'os_v2_app_vbzz6thjcbeqhjdg2mwejj7n5ametp2rycbedquywraandpzhmfoe6ducagrili5r7jdi3wig4e3jbjljnfkfr2x76ntguxpijgoerq';
const ONESIGNAL_APP_ID = 'a8739f4c-e910-4903-a466-d32c44a7ede8';

export const sendPushNoti = async (req: Request, res: Response) => {
  try {
  //   const { external_id } = req.body;
  //   console.log(external_id);

  //   if (!external_id) {
  //     return res.status(400).json({
  //       errors: ['Missing external_id'],
  //     });
  //   }

    const { external_id } = req.body;
    console.log(external_id);

    if (!external_id) {
      return res.status(400).json({
        errors: ['Missing external_id'],
      });
    }

    const response = await axios.post(
      'https://api.onesignal.com/notifications?c=push',
      {
        app_id: ONESIGNAL_APP_ID,
        include_external_user_ids: [external_id],
        // include_player_ids: [onesignal_id],
        headings: { en: 'Chacha OP!!' },
        contents: { en: 'ky ky mc' },
      },
      {
        headers: {
          Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log(response.data);

    // Handle warnings differently
    if (response.data.warnings) {
      console.warn('OneSignal Warnings:', response.data.warnings);
      return res.status(200).json({
        msg: 'Notification processed with warnings',
        warnings: response.data.warnings,
      });
    }

    res.status(200).json({
      msg: 'Notification sent successfully',
    })
  } 
  catch (error: any) {
    console.error(
      'OneSignal API Error:',
      error.response?.data || error.message,
    );
    res.status(500).json({
      error: 'Failed to send notification',
      details: error.response?.data || error.message,
    });
  }
};
