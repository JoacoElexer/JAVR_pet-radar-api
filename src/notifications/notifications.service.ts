import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
    constructor(private readonly mailerService: MailerService) { }

    async sendMatchNotification(
        ownerEmail: string,
        ownerName: string,
        lostPetName: string,
        foundPetCoords: number[],
        lostPetCoords: any,
        finderData: { name: string, phone: string, email: string, description: string, species: string, breed: string, color: string, size: string }
    ) {
        const mapboxToken = process.env.MAPBOX_TOKEN;
        const [foundLng, foundLat] = foundPetCoords;

        let lostLng: number, lostLat: number;
        if (Array.isArray(lostPetCoords)) [lostLng, lostLat] = lostPetCoords;
        else[lostLng, lostLat] = lostPetCoords.coordinates;

        const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-l+0000ff(${lostLng},${lostLat}),pin-s-m+ff0000(${foundLng},${foundLat})/auto/600x300?access_token=${mapboxToken}`;

        await this.mailerService.sendMail({
            to: ownerEmail,
            subject: `¡Buenas noticias! Posible coincidencia para ${lostPetName}`,
            html: `
            <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #2e6cbb;">¡Hola ${ownerName}!</h2>
                <p>Hemos encontrado una mascota que coincide con <strong>${lostPetName}</strong>.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #2e6cbb;">
                    <h4>Detalles del hallazgo:</h4>
                    <p><strong>Descripción:</strong> ${finderData.description}</p>
                    <p><strong>Encontrado por:</strong> ${finderData.name}</p>
                    <p><strong>Teléfono de contacto:</strong> ${finderData.phone}</p>
                    <p><strong>Email:</strong> ${finderData.email}</p>
                    <p><strong>Especie:</strong> ${finderData.species}</p>
                    <p><strong>Raza:</strong> ${finderData.breed}</p>
                    <p><strong>Color:</strong> ${finderData.color}</p>
                    <p><strong>Tamaño:</strong> ${finderData.size}</p>
                </div>

                <p>Ubicación del encuentro (Pin Rojo):</p>
                <img src="${mapUrl}" alt="Mapa" style="width: 75%; border-radius: 5px;"/>
                
                <p style="margin-top: 20px;">Por favor, contacta al buscador lo antes posible para confirmar si se trata de tu mascota.</p>
                <p>Atentamente,<br>El equipo de PetRadar</p>
            </div>
        `
        });
    }
}