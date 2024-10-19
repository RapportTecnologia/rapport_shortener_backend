import ContactModel from "../domain/Contact";
import CampaignModel from "../domain/Campaign";

export class CampaignRepository{
    async findCampaignByName(name: string): Promise<CampaignModel | null> {
        console.log(`Buscando campanha: ${name}`);
        const campaign = await CampaignModel.findOne({ where: { name } });
    
        if (campaign) {
          console.log(`Campanha encontrada: ${campaign.id} - ${campaign.name}`);
        } else {
          console.log(`Campanha não encontrada, será criada.`);
        }
    
        return campaign;
      }
    
      async createCampaign(name: string, description: string, contact: ContactModel): Promise<CampaignModel> {
        console.log(`Criando nova campanha: ${name} - ${contact.name}`);
        try {
          const campaign = await CampaignModel.create({ name, description, contact });
          console.log(`Nova campanha criado com sucesso: ${campaign.name}`);
          return campaign;
        } catch (error) {
          console.error('Erro ao criar o site:', error);
          throw error;
        }
      }
}