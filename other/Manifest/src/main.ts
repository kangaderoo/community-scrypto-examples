import {
  RadixDappToolkit,
  DataRequestBuilder,
} from '@radixdlt/radix-dapp-toolkit'

import { GatewayApiClient, RadixNetwork, StateNonFungibleLocationRequestAllOfToJSON, StateNonFungibleLocationRequestFromJSONTyped, StateNonFungibleLocationRequestToJSON } from '@radixdlt/babylon-gateway-api-sdk'

const mynetworkId = 1;

console.log ("network ID", mynetworkId);

// UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES UPDATES 

const dAppId = 'account_rdx1684rafcev320nyum73j5kmlwqhpld33s6ua0adtefhylvxje7kwqyy'

// UPDATES END 

const refreshButtonElement = document.getElementById("refreshwallet");
const recallButtonElement = document.getElementById("performrecall");
const leasedrecallButtonElement = document.getElementById("performleasedrecall");

let clientAddress = "<undefined>"
let vaultAddress = "<undefined>"
let COWResourceAddress = "resource_rdx1ngsg0n0z5p0ezjt6syw3twz66sy2k4q65hdpdspp3vqu9qgdfcnnlh"
let COWNFTid = "<Cauldron>"
let BALLSResourceAddress = "resource_rdx1tk8adlu9vc94a2m3gnerfsx5yg908sgw38nfchw7x6rl3ynumyaz5t"
let proofcomponent = "component_rdx1czkkkuanqg9ydg2g2ft476yllm4adyy7emda3vuymryur8xhf6efaa"
let BallsBallance = 0

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
  let logclientAddress = clientAddress.substring(0,10)+"..."+clientAddress.substring(clientAddress.length-10,clientAddress.length);
  document.getElementById('walletAddress').innerText = logclientAddress  

  recallButtonElement.textContent="Using Own $BALLs"
  leasedrecallButtonElement.textContent="Using Leased $BALLs"

  const getTokenDetails = await state.getNonFungibleLocation(
    COWResourceAddress,
    [COWNFTid]
  );

  console.log (getTokenDetails)
  if (getTokenDetails.total_count != 0){
    vaultAddress = getTokenDetails[0].owning_vault_address;
    let logvaultAddress = vaultAddress.substring(0,10)+"..."+vaultAddress.substring(vaultAddress.length-10,vaultAddress.length);
    document.getElementById('vaultAddress').innerText = logvaultAddress
    let owningAddress= getTokenDetails[0].owning_vault_global_ancestor_address
    let logowningAddress = owningAddress.substring(0,10)+"..."+owningAddress.substring(owningAddress.length-10,owningAddress.length);
    document.getElementById('owningAddress').innerText = logowningAddress
  }

  const getBallsDetails = await state.innerClient
  .entityFungibleResourceVaultPage({
    stateEntityFungibleResourceVaultsPageRequest: {
      address: clientAddress,
      resource_address: BALLSResourceAddress,
    }
  });

  console.log (getBallsDetails)

  BallsBallance = 0;
  if (getBallsDetails.total_count != 0){
    for (let i = 0; i < getBallsDetails.total_count; i++) {
      let amount = parseFloat(getBallsDetails.items[i].amount,10);
      if (!isNaN(amount)){
        BallsBallance += amount
      }
    }
  }
  document.getElementById('BallHoldings').innerText = BallsBallance

});

recallButtonElement.addEventListener("click", async () => {
  let manifest = `
  CALL_METHOD
    Address("${clientAddress}")
    "create_proof_of_amount"
    Address("${BALLSResourceAddress}")
    Decimal("1000000")
  ;
  RECALL_NON_FUNGIBLES_FROM_VAULT 
    Address("${vaultAddress}") 
    Array<NonFungibleLocalId>(
      NonFungibleLocalId("<Cauldron>")
    )
  ;
  CALL_METHOD Address("${clientAddress}") 
    "deposit_batch" 
    Expression("ENTIRE_WORKTOP")
  ;
`

  console.log (manifest)

  if (clientAddress == "<undefined>"){
    recallButtonElement.textContent = "Refresh first"
    leasedrecallButtonElement.textContent = "Refresh first"
  }else{
    if (vaultAddress=="<undefined>") {
      alert('This should not happen, if refresh does not work, Notify in TG channel')
    }
    else{
      const TxDetails = /* await */ radixDappToolkit.walletApi.sendTransaction({
        transactionManifest: manifest,
      });
    }
  }
});

leasedrecallButtonElement.addEventListener("click", async () => {
  let manifest = `
  CALL_METHOD
    Address("${proofcomponent}")
    "get_proof"
    Enum<0u8>()
  ;
  RECALL_NON_FUNGIBLES_FROM_VAULT 
    Address("${vaultAddress}") 
    Array<NonFungibleLocalId>(
      NonFungibleLocalId("<Cauldron>")
    )
  ;
  CALL_METHOD Address("${clientAddress}") 
    "deposit_batch" 
    Expression("ENTIRE_WORKTOP")
  ;
`
  
  console.log (manifest)

  if (clientAddress == "<undefined>"){
    recallButtonElement.textContent = "Refresh first"
    leasedrecallButtonElement.textContent = "Refresh first"
  }else{
    if (vaultAddress=="<undefined>") {
      alert('This should not happen, if refresh does not work, Notify in TG channel')
    }
    else{
      const TxDetails = /* await */ radixDappToolkit.walletApi.sendTransaction({
        transactionManifest: manifest,
      });
    }
  }
});
