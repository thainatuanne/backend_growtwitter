import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import prismaClient from "../../src/database/prisma.client";

jest.mock("../../src/database/prisma.client", () => ({
__esModule: true,
default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
mockReset(prismaMock);
});

export const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>;