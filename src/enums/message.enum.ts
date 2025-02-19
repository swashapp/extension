export enum SystemMessage {
  CLOSED_TAB_BEFORE_COMPLETE = "The tab was closed before the process was completed",
  FAILED_AD_SERVER_API_CALL = "Failed to send web request to the ad server. Please try again",
  FAILED_API_CALL = "Failed to send web request. Please try again",
  FAILED_DECRYPT_OLD_BACKUP = "Failed to decrypt the backup file",
  FAILED_DOWNLOAD_BACKUP_FILE = "Failed to download the backup file",
  FAILED_MIGRATION_STATUS = "Failed to get your migration status. Please try again later or contact the technical team by submitting a support ticket",
  FAILED_RESTORE_BACKUP_FILE = "Failed to restore the backup file",
  FAILED_SET_PASSWORD = "Failed to set the master password",
  FAILED_TAB_OPEN = "Failed to open the tab",
  FAILED_UPDATED_PHONE_NUMBER = "Failed to update the phone number",
  FAILED_UPLOAD_BACKUP_FILE = "Failed to upload the backup file",
  INVALID_PRIVATE_KEY = "Private key is not valid",
  INVALID_BACKUP_FILE = "Backup file is not valid",
  INVALID_CLOUD_TYPE = "Cloud type is not valid",
  NOT_ALLOWED_EMPTY_CHALLENGE = "The reCAPTCHA challenge is empty",
  NOT_ALLOWED_EMPTY_PASSWORD = "The master password is empty",
  NOT_ALLOWED_REASSIGN_EMAIL = "Email address cannot be changed after registration",
  NOT_ALLOWED_REASSIGN_WALLET = "Wallet address cannot be changed after registration",
  NOT_READY_APP = "The app is not ready. Please wait",
  SUCCESSFULLY_ADDED_FAV_SITE = "Favorite site has been added",
  SUCCESSFULLY_ADDED_REFERRAL_LINK = "Referral link has been created",
  SUCCESSFULLY_ADDED_ONGOING_DONATION = "Ongoing donation has been created",
  SUCCESSFULLY_CHANGED_BACKGROUND = "Background settings have been updated",
  SUCCESSFULLY_CHANGED_DATE_TIME = "Date & time settings have been updated",
  SUCCESSFULLY_CHANGED_SEARCH_ENGINE = "Search engine settings have been updated",
  SUCCESSFULLY_CREATE_BACKUP_FILE = "Backup file has been created",
  SUCCESSFULLY_UPLOAD_BACKUP_FILE = "Backup file has been uploaded",
  SUCCESSFULLY_COPIED = "Text copied successfully",
  SUCCESSFULLY_COPIED_PRIVATE_KEY = "Private key copied successfully",
  SUCCESSFULLY_COPIED_WALLET_ADDRESS = "Wallet address copied successfully",
  SUCCESSFULLY_MERGED_ACCOUNT = "Account has been merged",
  SUCCESSFULLY_SET_PASSWORD = "Master password has been set",
  SUCCESSFULLY_RESET_PASSWORD = "Master password has been reset",
  SUCCESSFULLY_STOP_ONGOING_DONATION = "Ongoing donation has been stopped",
  SUCCESSFULLY_UPDATED_PHONE_NUMBER = "Phone number has been updated",
  SUCCESSFULLY_UPDATED_PROFILE = "Profile has been updated",
  SUCCESSFULLY_REMOVE_FAV_SITE = "Favorite site has been removed",
  SUCCESSFULLY_WITHDRAW_TOKEN = "Token has been withdrawn",
  TIMEOUT_CLOUD_OAUTH_TOKEN = "Cloud OAuth token request timed out. Please try again",
  TIMEOUT_API_CALL = "The request has timed out. Please try again",
  UNEXPECTED_THINGS_HAPPENED = "Something unexpected happened. Please try again",
  UNSUPPORTED_RESPONSE_TYPE = "Response type is not supported",
}
