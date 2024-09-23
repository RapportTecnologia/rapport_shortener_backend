import ContactLoginModel from '../domain/Login';
import ContactModel from '../domain/Contact';

export class LoginRepository {

  async findByLogin(login: string): Promise<ContactLoginModel | null> {
    console.log(`Buscando login: ${login}`);
    const userLogin = await ContactLoginModel.findOne({ where: { login } });

    if (userLogin) {
      console.log(`Site encontrado: ${userLogin.contactId} - ${userLogin.username}`);
    } else {
      console.log(`Site não encontrado, será criado.`);
    }

    return userLogin;
  }

  async create(contact: ContactModel, login: string, password: string): Promise<ContactLoginModel> {
    console.log(`Criando novo login: ${login} - ${password}`);
    try {
      const userLogin = await ContactLoginModel.create({ login, password });
      console.log(`Novo login criado com sucesso: ${userLogin.contactId}`);
      return userLogin;
    } catch (error) {
      console.error('Erro ao criar o site:', error);
      throw error;
    }
  }
}