// fetch('https://fierce-bastion-10898.herokuapp.com/items').then(res => {
//   return res.json();
// }).then(data => {
//   console.log(data);
// });

const baseUri = 'http://fierce-bastion-10898.herokuapp.com'
// const baseUri = 'http://localhost:3000'
angular
  .module('kd', [])
  .controller('ctrl', ctrl)
  .directive('refreshButton', refreshButton)
  .directive('closeButton', closeButton)

function ctrl($rootScope, $http) {
  var vm = this
  angular.extend(vm, {
    item: {
      number: undefined,
      name: undefined,
    },
    list: getList(),
    addItem: addItem,
    deleteItem: deleteItem,
    refreshAll: refreshAll,
    editNumber: editNumber,
    cancelEdit: cancelEdit,
    saveEdit: saveEdit,
  })
  //get list
  function getList() {
    $http.get(`${baseUri}/items`).then(res => {
      vm.list = res.data.filter(d => !d.completed)
    })
  }

  function editNumber(index, item) {
    vm.editIndex = index
    vm.editedNumber = item.order
  }

  function addItem() {
    if (vm.item.number && vm.item.name) {
      $http
        .post(`${baseUri}/items`, {
          order: vm.item.number,
          desc: vm.item.name,
        })
        .then(res => {
          getList()
        })

      vm.item = {
        number: undefined,
        name: undefined,
      }
    }
    $('input[name=number]').focus()
  }

  function deleteItem(item) {
    $http
      .put(`${baseUri}/items/${item._id}`, {
        completed: true,
      })
      .then(() => {
        getList()
      })
  }

  function cancelEdit() {
    vm.editIndex = undefined
    vm.editedNumber = undefined
  }

  function saveEdit(index) {
    if (vm.editedNumber) {
      vm.list[index].order = vm.editedNumber
      $http
        .put(`${baseUri}/items/${vm.list[index]._id}`, {
          order: vm.list[index].order,
        })
        .then(() => {
          cancelEdit()
          getList()
        })
    }
  }

  function refreshAll() {
    $rootScope.$broadcast('refresh-all')
  }
}

function refreshButton() {
  return {
    restrict: 'E',
    template:
      '<button name="ref" class="btn btn-info" ng-click="refreshItem()">refresh</button>',
    link: function(scope, element, attrs) {
      scope.refreshItem = refreshItem
      scope.$on('refresh-all', refreshItem)

      function refreshItem() {
        var number = attrs.number
        var url
        if (
          !!~number.toLowerCase().indexOf('at') ||
          !!~number.toLowerCase().indexOf('td') ||
          !!~number.toLowerCase().indexOf('al')
        ) {
          //aol
          url =
            'http://aol-au.com/admin/weixin/waybill/toQueryResult?code=' +
            number

          var parent = element.parent().parent()
          var iframe = parent.find('iframe')
          if (iframe.length > 0) {
            iframe.attr('src', url)
          } else {
            iframe = angular.element('<iframe>')
            iframe.attr('src', url)
            parent.append(iframe)
          }
        } else if (number.indexOf('770') === 0) {
          //au
          url = 'http://auexpress.com.au/TOrderQuery_Service.aspx'
          var parent = element.parent().parent()
          submitForm(url, parent, 'OrderId', number)
        } else if (
          number.toLowerCase().indexOf('aj') === 0 ||
          number.toLowerCase().indexOf('em') === 0
        ) {
          //AJ
          url = 'http://www.ajexpress.com.au/cgi-bin/GInfo.dll?EmmisTrack'
          var parent = element.parent().parent()
          submitForm(url, parent, 'cno', number)
        } else if (number.indexOf('141') === 0) {
          // EXPRESS
          url = 'http://www.expressplus.com.au/cgi-bin/GInfo.dll?EmmisTrack'
          var parent = element.parent().parent()
          submitForm(url, parent, 'cno', number)
        } else if (
          number.indexOf('2001') === 0 ||
          number.toLowerCase().indexOf('ub') === 0
        ) {
          //aoud
          url = 'http://www.auodexpress.com/user.html#/way-search/' + number

          var parent = element.parent().parent()
          var iframe = parent.find('iframe')
          if (iframe.length > 0) {
            iframe.attr('src', url)
          } else {
            iframe = angular.element('<iframe>')
            iframe.attr('src', url)
            parent.append(iframe)
          }
        } else if (
          number.toLowerCase().indexOf('cj') === 0 ||
          number.toLowerCase().indexOf('ce') === 0
        ) {
          url = 'http://changjiangexpress.com/Home/Query'
          var parent = element.parent().parent()
          submitForm(url, parent, 'numbers', number)
        }
      }

      function submitForm(url, parent, inputName, number) {
        var form = parent.find('form')
        if (form.length === 0) {
          form = angular.element('<form>')
          var input = angular.element('<input>')
          input.attr('type', 'text')
          input.attr('name', inputName)
          input.val(number)

          form.attr('action', url)
          form.attr('method', 'post')
          form.attr('target', 'iframe-' + number)
          form.append(input)
          parent.append(form)
          form.hide()
        }

        var iframe = parent.find('iframe')
        if (iframe.length === 0) {
          iframe = angular.element('<iframe>')
          iframe.attr('name', 'iframe-' + number)
          parent.append(iframe)
        }
        form.submit()
      }
    },
  }
}

function closeButton() {
  return {
    restrict: 'E',
    template:
      '<button type="button" name="close"  class="btn btn-warning" ng-click="closeIframe()">hide</button>',
    link: function(scope, element, attrs) {
      scope.closeIframe = closeIframe

      function closeIframe() {
        var iframe = element
          .parent()
          .parent()
          .find('iframe')
        if (iframe.length > 0) {
          if (iframe.is(':visible')) {
            iframe.hide()
            element.find('button').text('show')
          } else {
            iframe.show()
            element.find('button').text('hide')
          }
        }
      }
    },
  }
}
