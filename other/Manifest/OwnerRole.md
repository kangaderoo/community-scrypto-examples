# Radix Manifest Examples

## Owner Role
This role can be set when generating accounts, tokens, NFTs etc. Formating of this is pretty standard for these occations.
```
SET_OWNER_ROLE
  Address("account / token / NFT / component")
  Enum<2u8>(
# 1.
# OwnerRole::None (0)
# OwnerRole::Fixed (1) 
# OwnerRole::Updatable (2)
	
    Enum<2u8>(
# 2.
# AccessRule::AllowAll(0)
# AccessRule::DenyAll(1) 
# AccessRule::Protected(2)

      Enum<0u8>(
# 3.
# AccessRuleNode::ProofRule(0)
# AccessRuleNode::AnyOf(1) 
# AccessRuleNode::AllOf(2)
			
        Enum<4u8>(
# 4.
# ProofRule::Require(0) 
# ProofRule::AmountOf(1) 
# ProofRule::CountOf(2) 
# ProofRule::AllOf(3) 
# ProofRule::AnyOf(4)
			
          Array<Enum>(
            Enum<1u8>("tokenaddress"),
            Enum<0u8>("NFTaddress:ID"))
))))
;
```
1.  None is an endpoint. In case of a Fixed of Updatable role the next is always step 2

2.  AllowAll and DenyAll are endponts. If Protected is selected the role can be set to having a combination of tokens and NFTs.

3. Using Proofrule will move to step *4. The other two setting implies an array of proofrules will be defined.

4. Proofrule types. CountOf, AllOf and AnyOf expects an Array, Require takes a single token or NFT, Amount is used to indicate an amount of a single token or NFT.

<b>note:</b><br>Using the ProofRule CountOf to define you need 2 of a token or 2 of a NFT collection resulted in a unwanted (locked) result. For amounts like 2 of a token the use of AmountOf works better.
CountOf should be used for example in a 2 out of 5 condition, where 5 <i>unique resources</i> are listed in the array.
