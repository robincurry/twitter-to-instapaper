// Saves options to chrome storage.
function save_options() {
  var username = document.getElementById("username");
  var pwd = document.getElementById("pwd");
  chrome.storage.local.set({"t2i_settings": {
    username: username.value,
    pwd: pwd.value
  }});

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores options from chrome storage.
function restore_options() {
  chrome.storage.local.get("t2i_settings", function(data){
    if (!data) {
      return;
    }
    var u_input = document.getElementById("username");
    u_input.value = data["t2i_settings"]["username"];
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
