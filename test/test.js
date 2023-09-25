// Change feat values
var selected_elem = document.getElementsByClassName('ddbc-select detail-choice-input')[1];
selected_elem.getElementsByTagName('option')[1].value = 773924;
selected_elem.selectedIndex = 1;
selected_elem.dispatchEvent(new window.Event('change', { bubbles: true }));


// change ASI values
var parent_elem = document.getElementsByClassName('ddbc-select detail-choice-input')[0];
parent_elem.selectedIndex = 2
parent_elem.dispatchEvent(new window.Event('change', { bubbles: true }));



for (var i=1; i < 10; i++) {
  setTimeout(function(){
  var selected_elem = document.getElementsByClassName('ddbc-select detail-choice-input')[1];

  if (document.getElementsByClassName('builder-sections-link builder-sections-section-class')[0] == null) {
    location.reload();
    document.getElementsByClassName('builder-sections-link builder-sections-section-class')[0].click();
    document.getElementsByClassName('collapsible-header')[7].click();
    var parent_elem = document.getElementsByClassName('ddbc-select detail-choice-input')[0];
    parent_elem.selectedIndex = 2
    parent_elem.dispatchEvent(new window.Event('change', { bubbles: true }));
  }
  else if (selected_elem == null) {
    document.getElementsByClassName('builder-sections-link builder-sections-section-class')[0].click();
    document.getElementsByClassName('collapsible-header')[7].click();
    var parent_elem = document.getElementsByClassName('ddbc-select detail-choice-input')[0];
    parent_elem.selectedIndex = 2
    parent_elem.dispatchEvent(new window.Event('change', { bubbles: true }));
  }

  setTimeout(function(){
   }, 3000);
   selected_elem = document.getElementsByClassName('ddbc-select detail-choice-input')[1];
  selected_elem.getElementsByTagName('option')[1].value = i;
  selected_elem.selectedIndex = 1;
  selected_elem.dispatchEvent(new window.Event('change', { bubbles: true }));

}, 3000);
}






//  loop
  // search class nav
  // search elem










selected_elem.options.forEach((item, i) => {
  if (item.value == i) {
    console.log(item.text);
  }
});

for (var j = 0; j < selected_elem.options.length; j++) {
  if (selected_elem.options[j] == i) {
    console.log(item.text);
  }
}







i =93

selected_elem = document.getElementsByClassName('ddbc-select detail-choice-input')[1];
  selected_elem.getElementsByTagName('option')[1].value = i;
  selected_elem.selectedIndex = 1;
  selected_elem.dispatchEvent(new window.Event('change', { bubbles: true }));
	document.getElementsByClassName('collapsible-header')[7].click();
document.getElementsByClassName('collapsible-header')[7].click();

  setTimeout(function(){
    for (var j = 0; j < selected_elem.options.length; j++) {
  if (selected_elem.options[j].value == i) {
    newdata = i+" : "+selected_elem.options[j].text;
    console.log(newdata);
  };
};
   }, 1000);




// flag extractor
countries_info = {};
for (var i = 0; i < 50; i++) {
  var country = document.getElementsByClassName('lzy lazyload--done')[i];
  countries_info[country.title] = country.src;
}
console.log(countries_info);
