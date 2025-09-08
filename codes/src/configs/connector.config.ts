export const connectorConfig = () => ({
  connector: {
    dpc: {
      baseurl: process.env.DPC_BASEURL,
      x_channel: process.env.DPC_X_CHANNEL,
      authorization_header: process.env.DPC_AUTHORIZATION,
      api_paths: {
        regular_products: process.env.DPC_REGULAR_PRODUCT_API_PATH,
        partner_products: process.env.DPC_PARTNER_PRODUCT_API_PATH,
        addon_products: process.env.DPC_ADDON_PRODUCT_API_PATH,
        package_products: process.env.DPC_PACKAGE_PRODUCT_API_PATH,
        autopay_products: process.env.DPC_AUTOPAY_PRODUCT_API_PATH,
        templates: process.env.DPC_TEMPLATES_API_PATH,
      },
    },
    pol: {
      baseurl: process.env.POL_BASEURL,
      service_id: process.env.POL_SERVICE_ID,
      service_key: process.env.POL_SERVICE_KEY,
      x_lb_host: process.env.POL_X_LB_HOST,
      api_paths: {
        regular_payment: process.env.POL_REGULAR_PAYMENT_API_PATH,
        one_tap_payment: process.env.POL_ONE_TAP_PAYMENT_API_PATH,
        recharge_and_activate_payment:
          process.env.POL_RECHARGE_AND_ACTIVATE_API_PATH,
        refund: process.env.POL_REFUND_API_PATH,
        status_check: process.env.POL_STATUS_CHECK_API_PATH,
        payment_and_recharge: process.env.POL_PAYMENT_AND_RECHARGE_API_PATH,
        payment_and_recharge_status:
          process.env.POL_PAYMENT_AND_RECHARGE_STATUS_API_PATH,
      },
    },
    subs_ms: {
      baseurl: process.env.SUBS_MS_BASEURL,
      authorization_header: process.env.SUBS_MS_AUTHORIZATION_HEADER,
      api_paths: {
        order_purchases: process.env.SUBS_MS_ORDER_PURCHASES_API_PATH,
        order_details: process.env.SUBS_MS_ORDER_STATUS_API_PATH,
      },
    },
    fuse: {
      baseurl: process.env.FUSE_SYSTEM_BASEURL,
      baseUrlOrder: process.env.FUSE_SYSTEM_ORDER_BASEURL,
      authorization_header: process.env.FUSE_AUTHORIZATION,
      channel_media: process.env.FUSE_CHANNEL_MEDIA,
      source_system_id: process.env.FUSE_SOURCE_SYSTEM_ID,
      api_paths: {
        offer_list: process.env.FUSE_OFFER_LIST_API_PATH,
        manage_product: process.env.FUSE_MANAGE_PRODUCT_API_PATH,
        status_check: process.env.FUSE_STATUS_CHECK_API_PATH,
      },
    },
    sms_notification: {
      baseurl: process.env.SMS_NOTIFICATION_BASEURL,
      x_authorization_key: process.env.SMS_NOTIFICATION_X_AUTHORIZATION_KEY,
      api_paths: {
        send_notification:
          process.env.SMS_NOTIFICATION_SEND_NOTIFICATION_API_PATH,
      },
    },
    push_notification: {
      baseurl: process.env.PUSH_NOTIFICATION_BASEURL,
      x_client_secret: process.env.PUSH_NOTIFICATION_X_CLIENT_SECRET,
      host: process.env.PUSH_NOTIFICATION_HOST,
      api_paths: {
        send_notification:
          process.env.PUSH_NOTIFICATION_SEND_NOTIFICATION_API_PATH,
      },
    },
    charging_system: {
      baseurl: process.env.CHARGING_SYSTEM_BASEURL,
      authorization_header: process.env.CHARGING_AUTHORIZATION,
      user_agent: 'MyGP/4.3/1.0',
      x_app_key: process.env.CHARGING_X_APP_KEY,
      x_app_secret: process.env.CHARGING_X_APP_SECRET,
      api_paths: {
        notify_charging: process.env.CHARGING_SYSTEM_NOTIFY_CHARGING_API_PATH,
      },
    },
    mnp: {
      baseurl: process.env.MNP_BASEURL,
      api_paths: {
        mnp_checking: process.env.MNP_CHECKING_API_PATH,
      },
    },
  },
});
