import asyncHandler from 'express-async-handler'
import Brand from '../models/brandModal.js';
import cloudinary from '../config/cloudinary.js';

// getBrands
const getBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find({});
    res.json(brands)
})

const createBrand = asyncHandler(async (req, res) => {
    const { name, image } = req.body;

    const brandExists = await Brand.findOne({ name })

    if (brandExists) {
        res.status(400).json({ message: "Brand already exists" })
    }
    let imageUrl = "";
    if (image) {
        const result = await cloudinary.uploader.upload(image, {
            folder: "Baby-mart/brands"
        });
        imageUrl = result.secure_url
    };
    const brand = await Brand.create({
        name,
        image: imageUrl || undefined,
    });
    if (brand) {
        res.status(201).json(brand)
    } else {
        res.status(400).json({ message: "Invalid Brand Data" })
    }
})

// getBrandById
const getBrandById = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (brand) {
        res.json(brand)
    } else {
        res.status(404).json({ message: "Brand Not Found" })
    }
})

// updateBrand
const updateBrand = asyncHandler(async (req, res) => {
    const { name, image } = req.body;
    const brand = await Brand.findById(req.params.id);
    if (brand) {
        brand.name = name || brand.name;
        if (image !== undefined) {
            if (image) {
                const result = await cloudinary.uploader.upload(image, {
                    folder: "Baby-mart/brands",
                });
                brand.image = result.secure_url;
            } else {
                brand.image = undefined;
            }
        }
        const updatedBrand = await brand.save();
        res.json(updatedBrand)
    }else{
        res.status(404).json({message: "Brand not found"})
    }
})

// deleteBrand
const deleteBrand = asyncHandler(async(req, res) => {
    const brand = await Brand.findById(req.params.id);
    if(brand){
        await brand.deleteOne();
        res.status(201).json({message: "Brand Removed"})
    }else{
        res.status({message: "Brand bot found"})
    }
})

export { getBrands, createBrand, getBrandById, updateBrand, deleteBrand };