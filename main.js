const min = window.min;

// context for canvas for sketching
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// context for canvas for tree visualization
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");

// context for canvas for tree drawing from JSON
const canvas3 = document.getElementById("canvas3");
const ctx3 = canvas3.getContext("2d");


var penColor = '#ACD3ED';
var coord = { x: 0, y: 0 };

// Node
var root = null;
var idVal = 0
var maxChildren = 5;

// Stroke
var strokes = [];
var currentStroke = null;
var pair = [];

// Position of visual
const nodePosition = [];
var currentPosition = {x:'', y:''};

var x = 0, y = 0;

// Current path in tree
var workingList = [];
var nodeList = [];

//leaf nodes and popped nodes when undo
var leaves = [];
var popped = [];


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
    notifier.classList.remove('hidden');
    notifier.innerHTML = '';
  }
  if (event.altKey == true && parseInt(event.key) <= children) {
    redoCertainChild(currentStroke, parseInt(event.key)-1)

  }
  else if (event.altKey == true && parseInt(event.key) > children) {
    let notifier = document.getElementById('notifier')
    notifier.innerHTML = 'requested branch doesnot exist';
    notifier.classList.add('hidden');
    // console.log('requested branch doesnot exist');
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


function pointToCurrentNode() {
  ctx2.beginPath();
  ctx2.fillStyle = 'red';
  ctx2.arc(currentPosition.x+8, currentPosition.y-6, 2, 0, 2 * Math.PI);
  ctx2.fill();
  ctx2.stroke();
}

// sizes the canvas element
function resize() {
  var value = 600;
  ctx.canvas.width = value;
  ctx.canvas.height = value;

  ctx2.canvas.width = value;
  ctx2.canvas.height = value;

  ctx3.canvas.width = value;
  ctx3.canvas.height = value;

  drawSequence();
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
// cantains logic for drawing a line from point a to point b
function draw(event) {

  if (pair.length > 2) {
    pair[0] = pair[1];
    pair[1] = pair[2];
    // console.log(pair);
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

  function addToTree(stroke) {
    if (root == null) {
      root = new NodeTemp(stroke, idVal);
      currentStroke = root;
      nodePosition.push({'x':30, 'y':30, 'id':root.id});
      currentPosition = {'x':30, 'y':30};
      drawTreeUsingCoord();
      pointToCurrentNode();
      // console.log('current '+ currentPosition.x +','+currentPosition.y);
      return;
    }
    idVal = idVal +1;
    newNode = addChild(nodeList[nodeList.length - 1], stroke);
    currentStroke = newNode;
    drawTreeUsingCoord();
    pointToCurrentNode();
    console.log('new node added');
    // console.log('current '+ currentPosition.x +','+currentPosition.y);
  }


  function undo(){
    drawStroke(nodeList[nodeList.length - 1].data,6, 'white',ctx)
    popped.push(nodeList.pop());
    if (nodeList.length == 0) {
      nodeList.push(root);
      var position = nodePosition[strokes.indexOf(nodeList[nodeList.length - 1].data)];
      currentPosition = {'x':position.x, 'y':position.y};
      drawSequence();
      drawTreeUsingCoord()
      pointToCurrentNode();
    }
    currentStroke = nodeList[nodeList.length - 1];
    var position = nodePosition[strokes.indexOf(nodeList[nodeList.length - 1].data)];
    currentPosition = {'x':position.x, 'y':position.y};
    drawSequence();
    drawTreeUsingCoord()
    pointToCurrentNode();
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
      var position = nodePosition[strokes.indexOf(nodeList[nodeList.length - 1].data)];
      currentPosition = {'x':position.x, 'y':position.y};
      drawSequence();
      drawTreeUsingCoord()
      pointToCurrentNode();
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
    drawfromStrokes(nodeList);
  }





  function drawcircle(x,y,radius, text=''){
    ctx2.beginPath();
    ctx2.fillStyle = 'white';
    ctx2.arc(x, y, radius, 0, 2 * Math.PI);
    ctx2.fill();

    ctx2.fillStyle = 'black';
    ctx2.fillText(text, x-3, y+3)

    ctx2.stroke();
  }


  function drawTreeUsingCoord(){
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
    var jsonTree = Flatted.stringify(root);
    var textarea = document.getElementById("jsonText");
    textarea.innerHTML =jsonTree;
  }

  function jsonToImage(){
    var givenRoot = Flatted.parse(document.getElementById("referenceJson").value);
    traverseTree(givenRoot);
    var pathOne = pathTonode(leaves[1]);
    pathOne.forEach((item, i) => {
      drawStroke(item.data, 5, '#ACD3ED',ctx3);
    });
  }
  function setMaxDegree(){
    var givenRoot = document.getElementById("maxDegree").value;
    maxChildren = givenRoot;
  }
