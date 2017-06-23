window.onload = function() {
  var socket = io(),
  ctx;

  socket.on('point drawn', function(msg){
    ctx.fillCircle(msg.x, msg.y, msg.radius, msg.fillColor);
  });

  function Canvas(parent, height, width, color) {
    this.node = document.createElement('canvas');
    this.context = this.node.getContext('2d');
    this.node.width = width || 100;
    this.node.height = height || 100;

    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.node.width, this.node.height);
    parent.appendChild(this.node);
  }

  function init(parent, fillColor) {
    var canvas = new Canvas(parent, 800, 600, fillColor);
    ctx = canvas.context;

    ctx.fillCircle = function(x, y, radius, fillColor) {
      this.fillStyle = fillColor;
      this.beginPath();
      this.moveTo(x, y);
      this.arc(x, y, radius, 0, Math.PI * 2, false);
      this.fill();
    };

    canvas.node.onmousemove = function(e) {
      if (!canvas.isDrawing) {
         return;
      }
      var x = e.pageX - this.offsetLeft;
      var y = e.pageY - this.offsetTop;
      var radius = 5;
      var fillColor = '#42f4eb';
      ctx.fillCircle(x, y, radius, fillColor);

      // emit(x, y, radius, fillColor)
      socket.emit('point drawn', {
        x: x,
        y: y,
        radius: radius,
        fillColor: fillColor
      });
    };

    canvas.node.onmousedown = function(e) {
      canvas.isDrawing = true;
    };
    canvas.node.onmouseup = function(e) {
      canvas.isDrawing = false;
    };
  }

  var container = document.getElementById('canvas');
  init(container, '#ddd');
};
