var express = require('express');
var router = express.Router();
var admin = require('../model/admin');
var danhmucsanpham = require('../model/danhmucsanpham');
var sanpham = require('../model/sanpham');
var danhmuctintuc = require('../model/danhmuctintuc');
var tintuc = require('../model/tintuc');
var slide = require('../model/slider');
var user = require('../model/user');
var empty = require('is-empty');
//ham upload danh chung cho tat ca cac ham can up ảnh
var multer  = require('multer');
var anhsp = [];

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
    cb(null,Date.now() +'-'+ file.originalname  )
    }
})
  
var upload = multer({ storage: storage })

//kiem tra du lieu
var loggedin = function(req,res,next){
    if(req.session.admin){
        next();
    }
    else{
        res.redirect('../admin/login');
    }
}

//them danh muc san pham
router.get('/themdmsanpham', loggedin , function(req, res, next) {
    danhmucsanpham.find({},function(err,dulieu){
        console.log(dulieu);
        res.render('admin/sanpham/themdm', { title: 'them danh muc', data:dulieu });
    })
});


//them danh muc san pham xu dung ajax

router.post('/themdm', loggedin , function(req, res, next) {
    
    var danhmuc = {
        'name_dmsp' : req.body.name_dmsp
      }
      var dulieu = new danhmucsanpham(danhmuc);
      dulieu.save()
      .then(function(data){
          //console.log(data);
          res.json(data);
      })
      

});
//xoa doi tuong danh muc

router.post('/deletedm/:idcanxoa', loggedin , function(req, res, next) {
    danhmucsanpham.findByIdAndRemove(req.params.idcanxoa).exec()
    .then(function(data){
        res.json(data);
    })
});

//sua danh muc  san pham

router.post('/editdmsp/:idcansua',loggedin, function(req, res, next) {
    danhmucsanpham.findById(req.params.idcansua,function(err,dulieu){
      if(err) return handleError(err);
      dulieu.name_dmsp = req.body.name_dmsp;
      dulieu.save().then(function(data){
          res.json(data);
      })
    })
    
});

//them san pham
router.get('/themsanpham', loggedin , function(req, res, next) {
    danhmucsanpham.find({},function(err,dulieu){
        console.log(dulieu);
        res.render('admin/sanpham/themsanpham', { title: 'them danh muc', data:dulieu });
    })
});

//upload san pham
// up anh san pham
router.post('/upload',upload.any(), function(req, res, next) {
    var tentamthoi = req.files[0].path;
    anhsp.push(tentamthoi);
    console.log(anhsp);
    res.status(200).send(req.files);
});
  
  /* up san pham. */
router.post('/themsanpham', function(req, res, next) {
    var tensp = req.body.tensp;
    var gia = req.body.gia;
    var thongtin = req.body.thongtin;
    var soluong = req.body.soluong;
    var _iddmsp = req.body._iddmsp;
    var motsanpham = {
        "tensp" : tensp,
        "gia" : gia,
        "thongtin" : thongtin,
        "soluong" : soluong,
        "danhmuc" : _iddmsp,
        "anhsp" : anhsp
    }
    var dulieu = new sanpham(motsanpham);
    dulieu.save();
    anhsp = [];
    console.log(anhsp);
    res.redirect("../admin");

});

//danh sach sản phẩm
router.get('/danhsachsanpham', loggedin , function(req, res, next) {
    sanpham.find({}).populate('danhmuc').exec(function(err,dulieu){
        console.log(dulieu);
        res.render('admin/sanpham/danhsachsanpham', { title: 'Express' , data:dulieu});
    }) 
});

//xoa doi tuong san pham

router.post('/deletesp/:idcanxoa', loggedin , function(req, res, next) {
    sanpham.findByIdAndRemove(req.params.idcanxoa).exec()
    .then(function(data){
        res.json(data);
    })
});

// sửa sản phẩm

router.get('/editsanpham/:idcansua', loggedin , async function(req, res, next) { 
    var idcansua = req.params.idcansua || 1;
    const [result , cates] = await Promise.all([
        sanpham.findById(idcansua).exec(),
        danhmucsanpham.find({})
    ]);
    console.log(result);
    
    res.render('admin/sanpham/editsanpham',{
        title : "edit san pham",
        product : result,
        cates : cates
    });
});

router.post('/toeditsp/:idcansua', loggedin , function(req, res, next) {
    sanpham.findById(req.params.idcansua,function(err,dulieu){
        if(err) return handleError(err);
        dulieu.tensp = req.body.tensp;
        dulieu.gia = req.body.gia;
        dulieu.thongtin = req.body.thongtin;
        dulieu.soluong = req.body.soluong;
        dulieu.anhsp = anhsp;
        dulieu.danhmuc = req.body._iddmsp;
        dulieu.save();
        anhsp = [];
        res.redirect('../danhsachsanpham');
      })
});


//them danh muc tin tuc
router.get('/addcatenews', loggedin , function(req, res, next) {
    danhmuctintuc.find({},function(err,dulieu){
        console.log(dulieu);
        res.render('admin/news/danhmucnews', { title: 'them danh muc', data:dulieu });
    })
});

//them danh muc tin tuc xu dung ajax

router.post('/addnewscates', loggedin , function(req, res, next) {
    
    var danhmuc = {
        'cates_name' : req.body.cates_name
      }
      var dulieu = new danhmuctintuc(danhmuc);
      dulieu.save()
      .then(function(data){
          //console.log(data);
          res.json(data);
      })
      

});

//xoa doi tuong danh muc

router.post('/deletecatesnews/:idcanxoa', loggedin , function(req, res, next) {
    danhmuctintuc.findByIdAndRemove(req.params.idcanxoa).exec()
    .then(function(data){
        res.json(data);
    })
});

//sua danh muc tin tuc

router.post('/editcatesnews/:idcansua',loggedin, function(req, res, next) {
    danhmuctintuc.findById(req.params.idcansua,function(err,dulieu){
      if(err) return handleError(err);
      dulieu.cates_name = req.body.cates_name;
      dulieu.save().then(function(data){
          res.json(data);
      })
    })
    
});



//Thêm Tin tức

//them tin tuc
router.get('/addnews', loggedin , function(req, res, next) {
    danhmuctintuc.find({},function(err,dulieu){
        console.log(dulieu);
        res.render('admin/news/themtintuc', { title: 'them tin tuc', data:dulieu });
    })
});

// up anh tin tức
router.post('/uploadimgnews',upload.any(), function(req, res, next) {
    var tentamthoi = req.files[0].path;
    anhsp.push(tentamthoi);
    console.log(anhsp);
    res.status(200).send(req.files);
});
  
  /* up san pham. */
router.post('/addnews', function(req, res, next) {
    var title = req.body.title;
    var time = new Date();
    var content = req.body.content;
    var cates = req.body._idcates;
    var mottintuc = {
        "title" : title,
        "time" : time,
        "content" : content,
        "cates" : cates,
        "imgage" : anhsp
    }
    var dulieu = new tintuc(mottintuc);
    dulieu.save();
    anhsp = [];
    res.redirect("../admin");

});

//Danh sách tin tức
router.get('/listnews', loggedin , function(req, res, next) {
    tintuc.find({}).populate('cates').exec(function(err,dulieu){
        res.render('admin/news/danhsachtintuc', { title: 'Express' , data:dulieu});
    }) 
});

//xoa doi tuong san pham

router.post('/deletnews/:idcanxoa', loggedin , function(req, res, next) {
    tintuc.findByIdAndRemove(req.params.idcanxoa).exec()
    .then(function(data){
        res.json(data);
    })
});

// sửa Tin Tức

router.get('/editnews/:id', loggedin , async function(req, res, next) { 
    var id = req.params.id || 1 ;
    const [result , cates] = await Promise.all([
        tintuc.findById(id).exec(),
        danhmuctintuc.find({})
    ]);  
    res.render('admin/news/suatintuc',{
        title : "edit tin tuc",
        news : result,
        cates : cates
    });
});

router.post('/editnews/:idcansua', loggedin , function(req, res, next) {
    var anh = req.body.anh;

    // kiểm tra điều kiện khi không có up ảnh mới thì thôi lấy ảnh cũ
    if(empty(anhsp)){
        anhsp.push(anh);
    }
    tintuc.findById(req.params.idcansua,function(err,dulieu){
        if(err) return handleError(err);
        dulieu.title = req.body.title;
        dulieu.content = req.body.content;
        dulieu.cates = req.body._idcates;
        dulieu.imgage = anhsp;
        dulieu.danhmuc = req.body._iddmsp;
        dulieu.save();
        anhsp = [];
        res.redirect('../listnews');
      })
});

//slider

router.get('/addslider', loggedin , function(req, res, next) {
    res.render('admin/slider/themslider', { title: 'thêm slider' });
});

// up anh slider
router.post('/uploadslider',upload.any(), function(req, res, next) {
    var tentamthoi = req.files[0].path;
    anhsp.push(tentamthoi);
    console.log(anhsp);
    res.status(200).send(req.files);
});

 /* up slider. */
 router.post('/addslider', function(req, res, next) {
    var title1 = req.body.title1;
    var title2 = req.body.title2;
    var motslider = {
        "title1" : title1,
        "title2" : title2,
        "image" : anhsp
    }
    var dulieu = new slide(motslider);
    dulieu.save();
    anhsp = [];
    res.redirect("../admin");

});
//Danh sách slide
router.get('/listslider', loggedin , function(req, res, next) {
    slide.find({}).exec(function(err,dulieu){
        res.render('admin/slider/danhsachslider', { title: 'Slider' , data:dulieu});
    }) 
});

//xoa doi tuong slide

router.post('/delteslider/:idcanxoa', loggedin , function(req, res, next) {
    slide.findByIdAndRemove(req.params.idcanxoa).exec()
    .then(function(data){
        res.json(data);
    })
});

// sửa slider

router.get('/editslider/:id', loggedin , async function(req, res, next) { 
    slide.findById(req.params.id,function(err,dulieu){
        res.render('admin/slider/editslider',{title :"Slider" , data :dulieu});
    });
});

router.post('/editslider/:idcansua', loggedin , function(req, res, next) {
    var anh = req.body.anh;

    // kiểm tra điều kiện khi không có up ảnh mới thì thôi lấy ảnh cũ
    if(empty(anhsp)){
        anhsp.push(anh);
    }
    slide.findById(req.params.idcansua,function(err,dulieu){
        if(err) return handleError(err);
        dulieu.title1 = req.body.title1;
        dulieu.title2 = req.body.title2
        dulieu.image = anhsp;
        dulieu.save();
        anhsp = [];
        res.redirect('../listslider');
      })
});


// user 

/* GET user. */
router.get('/user', loggedin , function(req, res, next) {
    user.find({}).populate({
        path :'giohang',
        populate:{path:"giohang"}
    }).exec(function(err,dulieu){
        console.log(dulieu.giohang);
        res.render('admin/user/danhsachuser', { title: 'Express' , data:dulieu});
    }) 
});
//xoa khach hang
router.post('/deletuser/:idcanxoa', loggedin , function(req, res, next) {
    user.findByIdAndRemove(req.params.idcanxoa).exec()
    .then(function(data){
        res.json(data);
    })
});

//khac hang chi tiet
router.get('/detailuser/:idkhachhang', loggedin , function(req, res, next) {
    user.findById(req.params.idkhachhang).populate({
        path : "giohang",
        populate:{path:"giohang"}
    }).exec(function(err,dulieu){
        res.render('admin/user/user-detail', { title: 'Express' , data:dulieu});
        console.log(dulieu);
    }) 
    
});


router.get('/testuser', loggedin , function(req, res, next) {
    var n = "kiencho";
    var pa = " kien";
    var a = "ha noi";
    var p = "2222";
    var g = ["5ba846c706c80702fc1c42b9","5ba8472206c80702fc1c42ba"];
    var motsanpham = {
        "username" : n,
        "password" : pa,
        "phone"    : p,
        "address"  : a,
        "giohang"   : g
    }
    var dulieu = new user(motsanpham);
    dulieu.save();
    console.log("thanh cong");
});




// them demo 1 nguoi dung



/* GET home page. */
router.get('/', loggedin , function(req, res, next) {
  res.render('admin/index', { title: 'Express' });
});
// load trang login
router.get('/login', function(req, res, next) {
    res.render('admin/login/login', { title: 'admin' });
});
//xem trang ca nhan
router.get('/profile',loggedin, function(req, res, next) {
    res.send(req.session.admin);    
});


// dang xuat
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err){
        res.render("admin/login");
    })
    
});



//kiem tra du lieu khi loggin
router.post('/login', function(req, res, next) {
    var body = req.body;
    var username = body.username;
    var password = body.password;
    // var dulieu = new admin();
    // dulieu.username = username;
    // dulieu.password = dulieu.hashPassword(password);
    // dulieu.save();
    admin.findOne({username:username},function(err,data){
        console.log(data);
        if(err){done(err)}
        else{
            if(data){
                var vail = data.comparePassword(password,data.password);
                console.log(vail);
                if(vail){
                    req.session.admin = data;
                    res.render('admin/index', { title: 'index' });
                }
                else{
                    require('/login');
                }
            }
        }
    })

});



module.exports = router;
