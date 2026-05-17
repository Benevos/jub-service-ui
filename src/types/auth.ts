export type AuthType = {
  access_token: string | null;
  temporal_secret_key: string | null;
};

export type RequiredAuthType = {
  access_token: string;
  temporal_secret_key: string;
};

export default AuthType;