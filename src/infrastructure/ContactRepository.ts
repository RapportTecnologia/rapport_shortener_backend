import ContactModel from '../domain/Contact';

export class ContactRepository {

  async findByContact(contact: string): Promise<ContactModel | null> {
    if(contact === undefined) throw new Error("Contato não informado");

    console.log(`Buscando owner pelo contact: ${contact}`);
    const owner = await ContactModel.findOne({ where: { contact } });

    if (owner) {
      console.log(`Contacto encontrado: ${owner.id} - ${owner.name}`);
    } else {
      console.log(`Contato não encontrado, será criado.`);
    }

    return owner;
  }

  async create(name: string, email: string, contact: string,
    type?: 'whatsapp_user' | 'whatsapp_group' | 'telgram_group' | 'telegram_user',
    origem?: string, description?: string): Promise<ContactModel> {
    console.log(`Criando novo site: ${name} - ${email} - ${contact} - {type} - ${origem} - ${description}`);
    try {
      const newOwner = await ContactModel.create({ name, email, contact, type, origem, description });
      console.log(`Novo Contato criado com sucesso: ${newOwner.id}`);
      return newOwner;
    } catch (error) {
      console.error('Erro ao criar o Contato:', error);
      throw error;
    }
  }
}