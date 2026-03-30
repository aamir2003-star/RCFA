import { VaultModel } from "../models/vault/vault.model.js";

export const createVaultItem = async (data) => {
    return await VaultModel.create(data);
};

export const getVaultByProject = async (projectId) => {
    return await VaultModel.find({ projectId }).populate("createdBy", "name email");
};

export const getVaultById = async (id) => {
    return await VaultModel.findById(id).populate("createdBy");
};

export const updateVaultItem = async (id, data) => {
    return await VaultModel.findByIdAndUpdate(id, data, { new: true });
};
