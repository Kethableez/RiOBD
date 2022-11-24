import { NextFunction, Request, Response } from "express";
import express from 'express';
import mongoose, { Document, Schema } from 'mongoose';

interface Item {
    name: string;
    value: number;
    isActive: boolean;
}

interface ItemModel extends Item, Document {}

const ItemSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        value: { type: Number, required: true },
        isActive: { type: Boolean, required: true },
    }
);

const Item = mongoose.model<ItemModel>('Item', ItemSchema);

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name, value, isActive } = req.body;

  const item = new Item({
    _id: new mongoose.Types.ObjectId(),
    name,
    value,
    isActive,
  });

  try {
    const response = await item.save();
    return res.status(201).json({ response });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const itemId = req.params.itemId;
  const toUpdate = req.body;
  try {
    const test = await Item.findByIdAndUpdate(itemId, toUpdate);
    return test
      ? res.status(200).json({ test })
      : res.status(404).json({ message: "not found" });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

const getItem = async (req: Request, res: Response, next: NextFunction) => {
  const itemId = req.params.itemId;

  try {
    const test = await Item.findById(itemId);
    return test
      ? res.status(200).json({ test })
      : res.status(404).json({ message: "not found" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Item.find();
    return res.status(200).json({ items });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  const itemId = req.params.itemId;

  try {
    const item = await Item.findByIdAndDelete(itemId);
    return item
      ? res.status(201).json({ item, message: "Deleted" })
      : res.status(404).json({ message: "not found" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};


const router = express.Router();

router.post('/create', create);
router.patch('/update/:itemId', update)
router.get('/get/:itemId', getItem);
router.get('/get/', getAll);
router.delete('/delete/:itemId', remove);

export = router;
