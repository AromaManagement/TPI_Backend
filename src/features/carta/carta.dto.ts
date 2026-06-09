import { z } from 'zod';

export const CreateCartaDto = z.object({
});

export type CreateCartaDtoType = z.infer<typeof CreateCartaDto>;

export type UpdateCartaDtoType = Partial<CreateCartaDtoType>;

export type UpdateCartaData = {
    updatedAt: Date;
    deletedAt?: Date | null;
};
