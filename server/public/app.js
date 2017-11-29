fetch('https://fierce-bastion-10898.herokuapp.com/items').then(res => {
  return res.json();
}).then(data => {
  console.log(data);
});
