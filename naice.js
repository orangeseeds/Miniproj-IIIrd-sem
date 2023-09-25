const min = window.min;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let coord = { x: 0, y: 0 };
let idVal = 0
canvas.addEventListener("mousedown", start);
canvas.addEventListener("mouseup", stop);
window.addEventListener("resize", resize);

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return;
  }

  var handled = false;
  if (event.altKey == true) {
    children = findPossibleChildren(currentStroke).length;
  }
  if (event.altKey == true && parseInt(event.key) <= children) {
    redoCertainChild(currentStroke, parseInt(event.key)-1)

  }
  else if (event.altKey == true && parseInt(event.key) > children) {
    console.log('requested branch doesnot exist');
  }
  else if (event.ctrlKey == true && event.key == 'z') {
    undo();
  }
  else if (event.ctrlKey == true && event.key == 'y') {
    redo();
  }

  if (handled) {
    event.preventDefault();
  }
} , true);

let strokes = [];

// var nodeCoord = {x:'', y:''};
const nodePosition = [];
var currentPosition = {x:'', y:''};
let currentStroke = null;
let root = null;

let pair = [];

let workingList = [];
let nodeList = [];
// sizes the canvas element
function resize() {
  ctx.canvas.width = 600;
  ctx.canvas.height = 600;

  drawSequence();
}

function resizeSmall() {
  // Resize the window, not the pen
    // Our canvas must cover full height of screen
    // regardless of the resolution
    var height = window.innerHeight;

    // So we need to calculate the proper scaled width
    // that should work well with every resolution
    var ratio = ctx.canvas.width / ctx.canvas.height;
    var width = height * ratio;

    ctx.canvas.style.width = width + 'px';
    ctx.canvas.style.height = height + 'px';
  // console.log('naicee');
  // ctx.scale(9,3);
}

resize();

// gets the current position of the cursor/painting-tip
function reposition(event) {
  var BB=canvas.getBoundingClientRect();

  coord.x=event.clientX-BB.left;
  coord.y=event.clientY-BB.top;
  // coord.x = event.clientX - canvas.offsetLeft;
  // coord.y = event.clientY - canvas.offsetTop;
}

// signals to start drawing a line from one point to the next and get new posiion for the cursor
function start(event) {


  document.addEventListener("mousemove", draw);
  reposition(event);
  // console.log('drawing');

  stroke = new Stroke();
  strokes.push(stroke);
  addToTree(stroke);
  workingList.push(currentStroke);
  nodeList.push(currentStroke);

}

// signals to stop drawing line
function stop() {
  document.removeEventListener("mousemove", draw);
}

let penColor = '#ACD3ED';
// cantains logic for drawing a line from point a to point b
function draw(event) {

  if (pair.length > 2) {
    pair[0] = pair[1];
    pair[1] = pair[2];
    pair.pop();
  }

  line = {begin:'' , end:''};
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = penColor;


  // Set the position to initial position
  ctx.moveTo(coord.x, coord.y);
  // pair.push(coord);

  // move the canvas point to moved position
  line.begin = {x:coord.x, y:coord.y}
  reposition(event);
  line.end = {x:coord.x, y:coord.y}

  // Draw a line between two points
  ctx.lineTo(coord.x, coord.y);
  ctx.stroke();
  stroke.path.push(line)
  // console.log(stroke);
}

function eraser() {
  penColor = "white";
}

function drawfromStrokes(nodes) {
  nodes.forEach((stroke, i) => {

    stroke.data.path.forEach((line, i) => {

      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#ACD3ED";

      // Set the position to initial position
      ctx.moveTo(line.begin.x, line.begin.y);

      // move the canvas point to moved position

      // Draw a line between two points
      ctx.lineTo(line.end.x, line.end.y);
      ctx.stroke();

    });

    currentStroke = stroke;

  });
}

function clearStrokes() {
  strokes.forEach((stroke, i) => {

    stroke.path.forEach((line, i) => {

      ctx.beginPath();
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.strokeStyle = "white";

      // Set the position to initial position
      ctx.moveTo(line.begin.x, line.begin.y);

      // move the canvas point to moved position

      // Draw a line between two points
      ctx.lineTo(line.end.x, line.end.y);
      ctx.stroke();

    });

  });
  strokes = [];
  currentStroke = null;
  root = null;

  pair = [];

  workingList = [];
  nodeList = [];

  clearTree();
}


  function drawStroke(singleStroke, width, color,context){
    singleStroke.path.forEach((line, i) => {

      context.beginPath();
      context.lineWidth = width;
      context.lineCap = "round";
      context.strokeStyle = color;

      // Set the position to initial position
      context.moveTo(line.begin.x, line.begin.y);

      // move the canvas point to moved position

      // Draw a line between two points
      context.lineTo(line.end.x, line.end.y);
      context.stroke();

    });
  }

class Stroke {
  constructor() {
    this.path = [];
  }
}

  class NodeTemp
  {
      constructor(data,id)
      {
          this.id = id;
          this.data=data;
          this.parent = null;
          this.next = this.child = null;
      }
  }

  let maxChildren = 5;
  // Adds a sibling to a list with starting with n
  function addSibling(node,data)
  {
      if(node == null)
          return null;
      var count = 1;
      const p = nodePosition[strokes.indexOf(node.data)];

      // var children = findPossibleChildren(node.parent).length;


      if (node.next == null) {
        nodePosition.push({'x':p.x+60, 'y':p.y});
        currentPosition = {'x':p.x+60, 'y':p.y};
        drawline([p.x+40,p.y],[p.x+10,p.y])
      }
      else {
        while(node.next != null){
          if ( count == maxChildren-1 ) {
            break
          }
          node = node.next;
          count = count +1;
        }

        nodePosition.push({'x':p.x + count*60, 'y':p.y});
        currentPosition = {'x':p.x + count*60, 'y':p.y};
        drawline([p.x + count*60,p.y],[p.x+10,p.y])
      }

      if (true) {

      }

      node.next = new NodeTemp(data, idVal);
      nodePosition[nodePosition.length -1].id = node.next.id;
      node.next.parent = node.parent;
      return node.next;
  }

  // Add child Node to a Node
  function addChild(node,data)
  {
      if(node == null)
          return null;

      handlePopped(node);
      // Check if child is not empty.
      if(node.child != null)
          return(addSibling(node.child,data));
      else
        var position = nodePosition[strokes.indexOf(node.data)];
        currentPosition = {'x':position.x, 'y':position.y+60};
        node.child = new NodeTemp(data, idVal);
        nodePosition.push({'x':position.x, 'y':position.y+60, 'id':node.child.id});
        node.child.parent = node;
        drawline([position.x,position.y],[position.x,position.y+60])
        return node.child;
  }

  // Traverses tree in breadth first order
  function traverseTree(rootNode)
  {
      if (rootNode == null)
        return;
      // console.log(rootNode);
      if (rootNode.child == null){
        // leaves.push(rootNode);
        return;
      }

      // Create a queue and enque rootNode
      let q = [];
      let curr = rootNode.child;
      q.push(curr);

      while (q.length!=0)
      {

        // Take out an item from the queue
        curr = q[0];
        q.shift();

        // Print next level of taken out item and enque
        // next level's children
        while (curr != null)
        {
          // console.log(curr);
          if (curr.child == null) {
            leaves.push(curr);
          }
          if (curr.child != null)
          {
            q.push(curr.child);
          }
          curr = curr.next;
        }
      }
  }

  function triggerTraverse()
  {
    traverseTree(root);
  }

  let leaves = [];
  // let possiblePaths = [];
  // let singlePath = []
  // singlePath.push(rootNode);
  function parentNode(rootNode){
    if(rootNode == null)
        return;

    while(rootNode != null)
    {
        // console.log(rootNode);
        if(rootNode.child != null){
          parentNode(rootNode.child);
          console.log(rootNode);
        }
        else{
          return 0;
        }
        rootNode = rootNode.next;
    }
  }

  function addToTree(stroke) {
    if (root == null) {
      root = new NodeTemp(stroke, idVal);
      currentStroke = root;
      nodePosition.push({'x':30, 'y':30, 'id':root.id});
      currentPosition = {'x':30, 'y':30};
      drawTreeUsingCoord();
      console.log('current '+ currentPosition.x +','+currentPosition.y);
      return;
    }
    idVal = idVal +1;
    newNode = addChild(nodeList[nodeList.length - 1], stroke);
    currentStroke = newNode;
    drawTreeUsingCoord();
    console.log('added');
    console.log('current '+ currentPosition.x +','+currentPosition.y);
    // console.log(root);
  }

  let popped = [];
  function undo(){
    drawStroke(nodeList[nodeList.length - 1].data,6, 'white',ctx)
    popped.push(nodeList.pop());
    if (nodeList.length == 0) {
      nodeList.push(root);
      drawSequence();
    }
    currentStroke = nodeList[nodeList.length - 1];
    drawSequence();
  }

  function redo(){
    if (popped.length == 0) {
      return "popped list null!";
    }
      nodeList.push(popped.pop());
      drawStroke(nodeList[nodeList.length - 1].data,5, '#ACD3ED',ctx);
  }

  function findPossibleChildren(node){
    var possibleChildren = [];
    if (currentStroke.child != null) {
      child = currentStroke.child;
      while (child != null) {
        possibleChildren.push(child);
        child = child.next;
      }
    }
    return possibleChildren;
  }

  function redoCertainChild(node, index){
    children = findPossibleChildren(node);
    if (children.length != 0) {
      popped.pop();
      nodeList.push(children[index]);
      drawStroke(children[index].data,5, '#ACD3ED',ctx);
      currentStroke = children[index];
    }

  }

  function handlePopped(node){
    popped =[];
  }

  function pathTonode(node){
    var path = [];
    while (node != null) {
      path.push(node);
      node = node.parent;
    }
    return path;
  }

  function drawSequence(){
    // drawfromStrokes(pathTonode(currentStroke));
    drawfromStrokes(nodeList);
  }


  const canvas2 = document.getElementById("canvas2");
  const ctx2 = canvas2.getContext("2d");

  ctx2.canvas.width = 600;
  ctx2.canvas.height = 600;

  let x = 0;
  let y = 0;
  function drawcircle(x,y,radius, text=''){
    ctx2.beginPath();
    // x,y from top left
    // ctx2.arc(x, y, radius, start degree, end degree);
    ctx2.fillStyle = 'white';
    ctx2.arc(x, y, radius, 0, 2 * Math.PI);
    ctx2.fill();

    ctx2.fillStyle = 'black';
    // ctx2.fill();
    ctx2.fillText(text, x-3, y+3)

    ctx2.stroke();
  }

  function showpositions() {
    console.log(nodePosition);
  }

  function drawTreeUsingCoord(){
    // ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
    nodePosition.forEach((item, i) => {
      drawcircle(item.x, item.y, 15, item.id);
    });

  }

  function drawline(obj1, obj2) {
    ctx2.beginPath();
    ctx2.moveTo(...obj1);
    ctx2.lineTo(...obj2);
    ctx2.stroke();
  }

  function clearTree(){
    window.location.reload();
  }

  function fillTextarea() {
    var seen = [];
    // var jsonTree = JSON.stringify(root, function(key, val) {
    //      if (val != null && typeof val == "object") {
    //           if (seen.indexOf(val) >= 0) {
    //               return;
    //           }
    //           seen.push(val);
    //       }
    //       return val;
    //   });
    var jsonTree = Flatted.stringify(root);
    var textarea = document.getElementById("jsonText");
    // textarea.innerHTML = JSON.stringify(JSON.parse(jsonTree), undefined, 4);
    textarea.innerHTML =jsonTree;
  }

  const canvas3 = document.getElementById("canvas3");
  const ctx3 = canvas3.getContext("2d");

  ctx3.canvas.width = 600;
  ctx3.canvas.height = 600;

  function jsonToImage(){
    var givenRoot = Flatted.parse(document.getElementById("referenceJson").value);
    traverseTree(givenRoot);
    var pathOne = pathTonode(leaves[1]);
    // drawfromStrokes(pathOne);
    pathOne.forEach((item, i) => {
      drawStroke(item.data, 5, '#ACD3ED',ctx3);
    });
  }
  function setMaxDegree(){
    var givenRoot = document.getElementById("maxDegree").value;
    maxChildren = givenRoot;
  }
