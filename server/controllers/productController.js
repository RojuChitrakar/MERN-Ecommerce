import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: "Sample Product",
      price: 0,
      user: req.user._id, // from protect middleware
      image: "/images/sample.jpg",
      brand: "Sample Brand",
      category: "Sample Category",
      countInStock: 0,
      numReviews: 0,
      description: "Sample description",
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, brand, category, countInStock } =
      req.body;

    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();

      res.status(200).json(updatedProduct);
    } else {
      res.status(200).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.status(200).json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createProductReview= async (req,res)=>{
  try{
    const {rating, comment}=req.body;
    const product=await Product.findById(req.params.id);
    if(product){
      const alreadyReviewed=product.reviews.find(
        (r)=>r.user.toString()===req.user._id.toString()
      );

      if(alreadyReviewed){
        return res.status(400).json({message:"Product already reviewed"});
      }

      const review={
        name:req.user.name,
        rating:Number(rating),
        comment,
        user:req.user._id
      };

      product.reviews.push(review);

      product.numReviews=product.reviews.length;

      product.rating=product.reviews.reduce((acc,item)=> item.rating+acc,0)/product.reviews.length;

      await product.save();

      res.status(201).json({message:"Review Added"});
    }else{
      res.status(404).json({message:"Product not found"});
    }

  }catch(error){
    console.error(error);
    res.status(500).json({message:"Server Error"});
    
  }
};