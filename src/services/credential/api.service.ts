import api from "../../config/axios";
import type { StudentCredentialDto } from "../../types/Credential";

const STUDENT_CREDENTIALS_URL =
  "https://uap-blockchain.azurewebsites.net/api/students/me/credentials";

class CredentialServices {
  static async getMyCredentials(): Promise<StudentCredentialDto[]> {
    const response = await api.get<StudentCredentialDto[]>(
      STUDENT_CREDENTIALS_URL
    );
    return response.data;
  }
}

export default CredentialServices;

