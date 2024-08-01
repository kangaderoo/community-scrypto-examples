import {
  RadixDappToolkit,
  DataRequestBuilder,
} from '@radixdlt/radix-dapp-toolkit'

import { GatewayApiClient, RadixNetwork } from '@radixdlt/babylon-gateway-api-sdk'

const mynetworkId = 1;

console.log ("network ID", mynetworkId);

// UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES 

const dAppId = 'account_rdx128mrnm4upe8p94sfze0ka605ktgpr5ckv7dwzpynh4c750tl0tc7yn'

// UPDATES END 

const refreshButtonElement = document.getElementById("refreshwallet");
const recallButtonElement = document.getElementById("performrecall");

let clientAddress = "<undefined>"
let vaultAddress = "<undefined>"
let COWResourceAddress = "resource_rdx1ngsg0n0z5p0ezjt6syw3twz66sy2k4q65hdpdspp3vqu9qgdfcnnlh"
let COWNFTid = "<Cauldron>"

const radixDappToolkit = RadixDappToolkit({
  dAppDefinitionAddress: dAppId,
  networkId: mynetworkId,
  featureFlags: ['ExperimentalMobileSupport'],
 });

radixDappToolkit.walletApi.setRequestData(
  DataRequestBuilder.persona(),
  DataRequestBuilder.accounts().exactly(1),
);

const gatewayApi = GatewayApiClient.initialize({
  networkId: RadixNetwork.Mainnet,
  applicationName: 'Chase the COW',
  applicationVersion: '1.0.0',
  applicationDappDefinitionAddress: dAppId
})
const { status, transaction, stream, state } = gatewayApi




refreshButtonElement.addEventListener("click", async () => {

  const temp = radixDappToolkit.walletApi.getWalletData();
  if (temp.accounts.length != 0){
    clientAddress = temp.accounts[0].address; 
  } else{

    const result = await radixDappToolkit.walletApi.sendRequest()

    if (result.isErr()) return alert(JSON.stringify(result.error, null, 2));

    clientAddress = result.value.accounts[0].address;
  }
  document.getElementById('walletAddress').innerText = clientAddress  

  const getTokenDetails = await state.getNonFungibleLocation(
    COWResourceAddress,
    [COWNFTid]
  );

  console.log (getTokenDetails)
  if (getTokenDetails.total_count != 0){
    vaultAddress = getTokenDetails[0].owning_vault_address;
    document.getElementById('vaultAddress').innerText = vaultAddress
    document.getElementById('owningAddress').innerText = getTokenDetails[0].owning_vault_global_ancestor_address  
  }


});

recallButtonElement.addEventListener("click", async () => {
  let manifest = `
RECALL_NON_FUNGIBLES_FROM_VAULT Address("${vaultAddress}") Array<NonFungibleLocalId>(NonFungibleLocalId("<Cauldron>"));
CALL_METHOD Address("${clientAddress}") "deposit_batch" Expression("ENTIRE_WORKTOP");
`
  console.log (manifest)

  if (clientAddress == "<undefined>"){
//    performFreezeButtonElement.textContent = "Refresh wallet first"
//    performMeltButtonElement.textContent = "Refresh wallet first"
  }else{
    if (vaultAddress=="<undefined>") {
      alert('This should not happen, if refresh does not work, Notify in TG channel')
    }
    else{
      const TxDetails = /* await */ radixDappToolkit.walletApi.sendTransaction({
        transactionManifest: manifest,
//        version: 1,
      });

   //   if (TxDetails.isErr()) return alert(JSON.stringify(TxDetails.error, null, 2));
  //      console.log (TxDetails)
    }
  }
});
