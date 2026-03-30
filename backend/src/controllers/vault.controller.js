import * as vaultService from "../services/vault.service.js";

export const createVaultItem = async (req, res, next) => {
    try {
        const item = await vaultService.createVaultItem({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json(item);
    } catch (error) {
        next(error);
    }
};

export const getProjectVault = async (req, res, next) => {
    try {
        const items = await vaultService.getVaultByProject(req.params.projectId);
        res.json(items);
    } catch (error) {
        next(error);
    }
};

export const updateVaultItem = async (req, res, next) => {
    try {
        const item = await vaultService.updateVaultItem(req.params.id, req.body);
        res.json(item);
    } catch (error) {
        next(error);
    }
};
