import ContactModel from '../domain/Contact';

  export class OwnerRepository{

    async findByWhatsapp(whatsapp: string): Promise<ContactModel | null> {
        console.log(`Buscando owner pelo URL: ${whatsapp}`);
        const owner = await ContactModel.findOne({ where: { contact: whatsapp } });
    
        if (owner) {
          console.log(`Site encontrado: ${owner.id} - ${owner.name}`);
        } else {
          console.log(`Site não encontrado, será criado.`);
        }
    
        return owner;
      }

      async create(name: string, email: string, whatsapp:string): Promise<ContactModel> {
        console.log(`Criando novo site: ${name} - ${email} - ${whatsapp}`);
        try {
          const newOwner = await ContactModel.create({ name, email, contact: whatsapp });
          console.log(`Novo site criado com sucesso: ${newOwner.id}`);
          return newOwner;
        } catch (error) {
          console.error('Erro ao criar o site:', error);
          throw error;
        }
      }
  }