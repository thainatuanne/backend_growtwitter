export interface CreateSeguidorDTO {
    usuarioId: number;  
    seguidorId: number; 
}

export interface UpdateSeguidorDTO {
    id: number;
    usuarioId?: number;
    seguidorId?: number;
}