var express = require('express');
var router = express.Router();
var danhmucsanpham = require('../model/danhmucsanpham');
var sanpham = require('../model/sanpham');
var danhmuctintuc = require('../model/danhmuctintuc');
var tintuc = require('../model/tintuc');
var slide = require('../model/slider');
var user = require('../model/user');
var emailsub = require("../model/emailsub");
var empty = require('is-empty');
//gửi mail
var nodemailer =  require('nodemailer');
//cart
var Cart = require('../model/cart');


/* GET home page. */
router.get('/', async function(req, res, next) {

  const [slidedata , productdata , newsdata ] = await Promise.all([
    slide.find({}).exec(),
    sanpham.find({}).populate('danhmuc'),
    tintuc.find({}).populate('cates')
  ]);
  res.render('index',{ 
    title: 'Express' ,
    datasession : req.session.passport,
    dataslide : slidedata,
    dataproduct : productdata,
    datanews : newsdata
  });
  
});
//sub email
router.post('/subscribeemail', function(req, res, next) {
  var data = {
    "email":req.body.emailsub
  }
  var dulieu = new emailsub(data);
  dulieu.save();
  res.redirect("register");

});

// get page shop
router.get('/shop/:page', async function(req, res, next) {
  var numberofpage = 12;
  var current = req.params.page ||  1;
  const [ productdata , catesdata , productcout ] = await Promise.all([
      sanpham.find({}).limit(numberofpage).populate("danhmuc").skip((numberofpage* current ) - numberofpage).exec(),
      danhmucsanpham.find({}),
      sanpham.countDocuments()
  ]);
  var numberpage = Math.ceil(productcout/numberofpage);
 
  res.render('shop/shop', { 
    title: 'Express',
    dataproduct : productdata,
    datacates : catesdata,
    coutproduct : productcout,
    pagenumber : numberpage,
    pagecurrent : current
   });
});

//get shop-cates
router.get('/shop-cates/:namecates',async function(req, res, next) {
  var namecates = req.params.namecates ||"New";
  const [productdata , catesdata ,productcout ] = await Promise.all([
      sanpham.find({}).populate("danhmuc").exec(),
      danhmucsanpham.find({}),
      sanpham.find({}).countDocuments()
  ]);

  res.render('shop/shop-cates', { 
     title: 'Express' ,
     dataproduct : productdata,
     datacates : catesdata,
     coutproduct : productcout,
     catename : namecates
  });
});

//get shop-singe
router.get('/shop-singe/:product_id',async function(req, res, next) {
  var productId = req.params.product_id || 1;
  const [productdataID,productdata] = await Promise.all([
      sanpham.findById(productId).populate("danhmuc").exec(),
      sanpham.find({}).populate("danhmuc")
  ]);
  console.log(productdataID);
  res.render('shop/shop-singe', { 
    title: 'Express' ,
    productdataID : productdataID,
    dataproduct : productdata
  });
});


// tin tuc

//get news trang chu tin
router.get('/news', async function(req, res, next) {
  const [newsdata,catesdata] = await Promise.all([
      tintuc.find({}).limit(5).populate("cates").exec(),
      danhmuctintuc.find({})
  ]);
  res.render('news/news', { 
    title: 'Express' ,
    datanews : newsdata,
    datacates : catesdata
  });
});

// get cac tin tuc cua cac danh muc san pham
router.get('/news-cate/:idcates', async function(req, res, next) {
  var idcates = req.params.idcates || 1;
  const [newsdata,catesdata] = await Promise.all([
      tintuc.find().populate("cates").exec(),
      danhmuctintuc.find({})
  ]);
  res.render('news/news-cate', { 
    title: 'Express' ,
    datanews : newsdata,
    datacates : catesdata,
    idcates : idcates
  });
});


//get news singne
router.get('/news-singe/:idnews', async function(req, res, next) {
  var idnews = req.params.idnews;
  const [newsdataid , newsdata ,catesdata] = await Promise.all([
    tintuc.findById(idnews).populate("cates").exec(),
    tintuc.find({}).populate("cates").exec(),
    danhmuctintuc.find({})
]);
  res.render('news/news-singe', { 
    title: 'Express' ,
    datanewsid : newsdataid,
    datanews : newsdata,
    datacates : catesdata
  });
  
});

//get contact

router.get('/contact', function(req, res, next) {
  res.render('contract/contact', { title: 'Express' });
});

//gui mail 
router.post('/sendmail', function(req, res, next) {
  var transporter =  nodemailer.createTransport({ // config mail server
      service: 'Gmail',
      auth: {
          user: 'mailserver@gmail.com',
          pass: 'password'
      }
  });
  var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
      from: 'Thanh Batmon',
      to: 'tomail@gmail.com',
      subject: 'Test Nodemailer',
      text: 'You recieved message from ' + req.body.email,
      html: '<p>You have got a new message</b><ul><li>Username:' + req.body.name + '</li><li>Email:' + req.body.email + '</li><li>Username:' + req.body.message + '</li></ul>'
  }
  transporter.sendMail(mainOptions, function(err, info){
      if (err) {
          console.log(err);
          res.redirect('/');
      } else {
          console.log('Message sent: ' +  info.response);
          res.redirect('/');
      }
  });
});

//get gio hang
router.get('/giohang', function(req, res, next) {
  res.render('user/giohang', { title: 'Express' });
});

// them san pham vao gio hang

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items : {}});
  sanpham.findById(productId , function(err,product){
    if(err){
      return res.redirect('/');
    }
    cart.add(product,product._id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  })
});

// cart
router.get('/shopping-cart', function(req, res, next) {
  if(!req.session.cart){
    return res.render('cart/cart',{product : null});
  }
  var cart = new Cart(req.session.cart);
  console.log(cart.generateArray());
  res.render('cart/cart', { product: cart.generateArray() , totalPrice : cart.totalPrice });
});



//ckeck out
router.get('/checkout', function(req, res, next) {
  if(!req.session.cart){
    return res.render('checkout/checkout',{product : null});
  }
  var cart = new Cart(req.session.cart);
  console.log(cart.generateArray());
  res.render('checkout/checkout', { product: cart.generateArray() , totalPrice : cart.totalPrice });
});



//get login
router.get('/login', function(req, res, next) {
  var message = req.flash('err');
  res.render('login/login', { title: 'Express' });
});

//get register
router.get('/register', function(req, res, next) {
  res.render('login/register', { title: 'Express' });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){
      res.render("login/login");
  })
  
});








module.exports = router;
