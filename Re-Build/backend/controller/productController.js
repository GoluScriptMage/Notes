const products = [
  { id: 1, name: "Product A", price: 100 },
  { id: 2, name: "Product B", price: 150 },
  { id: 3, name: "Product C", price: 200 },
];

const getAllProducts = (req, res) => {
  res.status(200).json(products);
};

const getProduct = (req, res) => {
  const productId = parseInt(req.params.id);

  const product = products.find((prod) => prod.id === productId);
  if (product) {
    res.status(200).json({ message: "Product Found" }, product);
  }
};

const createProduct = async (req, res) => {
  const { id, name, price } = req.body;
  const newProduct = await Product.create({ id, name, price });
  res.status(201).json({ message: "Product Created Successfully" }, newProduct);
};