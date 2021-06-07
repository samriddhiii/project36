var database;
var dog,sadDog,happyDog;
var foodS,foodStock;
var addFood, foodObj;

//create feed and lastFed variable here
var feed, lastFed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  lastFed=createButton("Feed the dog");
  lastFed.position(800,120);
  lastFed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(700,120);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  var dbref = database.ref('FeedTime');
  dbref.on("value", (data) => {
    lastFed = data.val()
  })
 
  //write code to display text lastFed time here
  textSize(20)
  fill("black")
 
 if(lastFed <=12){
  text("Last Feed:" + lastFed + "AM", 200,55)
 } else if(lastFed === 0){
  text("Last Feed: 12 AM", 200,55)
 }else{
  text("Last Feed:" + (lastFed % 12) + " PM", 200,55)
 }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);

  var food_stock_val = foodObj.getFoodStock() 
  if(food_stock_val<=0){
    foodObj.updateFoodStock(food_stock_val*0)
}else{
    foodObj.updateFoodStock(food_stock_val-1)
  }
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  foodS--;
  database.ref('/').update({
    Food : foodS,
    FeedTime : hour()
  }) 
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  })
}
