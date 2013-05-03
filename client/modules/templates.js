define(['handlebars'], function(Handlebars) {

this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["member_profile"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "style=\"background-color: ";
  if (stack1 = helpers.hexColor) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.hexColor; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program3(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.favSweet) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.favSweet; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program5(depth0,data) {
  
  
  return "—";
  }

function program7(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.favSeason) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.favSeason; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<div class=\"description\">\n    <div class=\"description__rule\" ";
  stack1 = helpers['if'].call(depth0, depth0.hexColor, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "></div>\n    <p>";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n</div>\n";
  return buffer;
  }

function program11(depth0,data) {
  
  
  return "\n<div class=\"feed\"></div>\n";
  }

  buffer += "<div class=\"media-object\">\n\n    <div class=\"media-object__media\">\n        \n        <div class=\"ribotar\" ";
  stack1 = helpers['if'].call(depth0, depth0.hexColor, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n            <div class=\"image\" data-src=\"";
  if (stack1 = helpers.ribotarURL) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.ribotarURL; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></div>\n        </div>\n\n    </div>\n\n    <div class=\"media-object__body\">\n\n        <dl class=\"data\">\n            <div class=\"data__item\">\n                <dt class=\"data__label\">";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers.idiom),stack1 ? stack1.call(depth0, "fav_sweet_label", options) : helperMissing.call(depth0, "idiom", "fav_sweet_label", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</dt>\n                <dd class=\"data__value\">";
  stack2 = helpers['if'].call(depth0, depth0.favSweet, {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</dd>\n            </div>\n            <div class=\"data__item\">\n                <dt class=\"data__label\">";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers.idiom),stack1 ? stack1.call(depth0, "fav_season_label", options) : helperMissing.call(depth0, "idiom", "fav_season_label", options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</dt>\n                <dd class=\"data__value\">";
  stack2 = helpers['if'].call(depth0, depth0.favSeason, {hash:{},inverse:self.program(5, program5, data),fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</dd>\n            </div>\n        </dl>\n\n    </div>\n\n</div>\n\n";
  stack2 = helpers['if'].call(depth0, depth0.description, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n";
  stack2 = helpers['if'].call(depth0, depth0.twitter, {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  return buffer;
  });

this["Handlebars"]["templates"]["splash"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<div class=\"splash\"></div>";
  });

this["Handlebars"]["templates"]["team"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <section class=\"section\" data-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-url=\"";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n\n        <div class=\"section__back\"></div>\n\n        <header class=\"section__header\">\n            <h1 class=\"section__title\"><span><b>";
  if (stack1 = helpers.firstName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.firstName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</b> ";
  if (stack1 = helpers.lastName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.lastName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span></h1>\n            <h2 ";
  stack1 = helpers['if'].call(depth0, depth0.hexColor, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">";
  stack1 = helpers['if'].call(depth0, depth0.role, {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h2>\n        </header>\n\n        <div class=\"section__body\"></div>\n        \n    </section>\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "style=\"background-color: ";
  if (stack1 = helpers.hexColor) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.hexColor; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ";\"";
  return buffer;
  }

function program4(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.role) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.role; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program6(depth0,data) {
  
  
  return "—";
  }

  buffer += "<div class=\"section-list\">\n\n    ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["fragments/tweet_list"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<div class=\"tweet\">\n    <p class=\"tweet__body\">";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n    <footer class=\"tweet__footer\">";
  if (stack1 = helpers.date) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.date; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</footer>\n</div>\n";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0.tweets, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });

return this["Handlebars"]["templates"];

});