import { createCanvas, loadImage, type CanvasRenderingContext2D } from 'canvas';

function roundedImage(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number){
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

export async function createUserMetaImage(name: string, avatarImage: string) {
    const
        width = 957,
        height = 478,
        canvas = createCanvas(width, height),
        ctx = canvas.getContext('2d');

    ctx.font = '48px Impact'
    ctx.fillText(name, 128, 128)

    const avatar = await loadImage(avatarImage);

    ctx.save();
    roundedImage(ctx, width - 64 - 128, 64, 128, 128, 15);
    ctx.clip();
    ctx.drawImage(avatar, width - 64 - 128, 64, 128, 128);
    ctx.restore();

    
    return canvas.toDataURL('image/png');
}