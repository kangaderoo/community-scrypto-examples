from radix_engine_toolkit import * 
from typing import List, Dict, Any
from typing import Tuple
import configparser
import secrets
import re
import requests
import json

NETWORK_ID: int = 1   
GATEWAYS = ['https://mainnet.radixdlt.com/', 'https://stokenet.radixdlt.com/']

class RadixNetwork:
    def __init__(self):
        self.nftaddress = 'resource_rdx1ngsg0n0z5p0ezjt6syw3twz66sy2k4q65hdpdspp3vqu9qgdfcnnlh'
        self.nftid= '<Cauldron>'

    #   Simple gateway API communication function.
    def gatewaypost(self, **kwargs) -> str:
        url = kwargs['url']
        api = kwargs['api']
        obj = kwargs['obj']
        fullpath = f'{url}{api}'
        return requests.post(fullpath, json = obj).text
    

    def gethistoryatstateversion(self, stateversion) -> {}:
        req = f"""
        {{
            "resource_address": "{self.nftaddress}",
            "non_fungible_ids": [
                "{self.nftid}"
            ]
        }}
        """
        if stateversion > 0:
            req = f"""
            {{
                "resource_address": "{self.nftaddress}",
                "non_fungible_ids": [
                    "{self.nftid}"
                ],
                "at_ledger_state": {{"state_version": {stateversion}}}
            }}
            """
        txobject = json.loads(req)
        response = json.loads(self.gatewaypost(
            url = GATEWAYS[NETWORK_ID-1],
            api = '/state/non-fungible/location',
            obj = txobject
        ))
        return response


    def gethistory(self):
        locations = []
        response = self.gethistoryatstateversion(0);
        info = response.get('non_fungible_ids')
        time = response.get('ledger_state').get('proposer_round_timestamp')
        laststateversion = info[0].get('last_updated_at_state_version')
        locations.append(f'''{time} {info[0].get('owning_vault_global_ancestor_address')} {laststateversion}''')
        while laststateversion > 0:
            response = self.gethistoryatstateversion(laststateversion-1);
            if response.get('code')==None:
                info = response.get('non_fungible_ids')
                time = response.get('ledger_state').get('proposer_round_timestamp')
                laststateversion = info[0].get('last_updated_at_state_version')
                locations.append(f'''{time} {info[0].get('owning_vault_global_ancestor_address')} {laststateversion}''')
            else:
                laststateversion = 0

        for entry in locations:
            print (f"{entry}")

    def gettxid(self, state):
        req = f"""
            {{
            "limit_per_page": 1,
            "at_ledger_state": {{"state_version": {state}}}
            }}        
        """
        txobject = json.loads(req)
        response = json.loads(self.gatewaypost(
            url = GATEWAYS[NETWORK_ID-1],
            api = '/stream/transactions',
            obj = txobject
        ))
        print (response.get('items')[0].get('intent_hash'))

        



if __name__ == "__main__":
    RadixNetwork = RadixNetwork()
    RadixNetwork.gethistory()
    RadixNetwork.gettxid(110357902)
                           