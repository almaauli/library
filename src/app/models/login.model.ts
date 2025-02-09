export interface LoginResponse {
    token: string;
    user: {
      userId: number;
      username: string;
      role: string;
      namaLengkap: string;
      nomorTelepon: string;
    };
  }
  