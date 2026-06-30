// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PaymentEvidenceRegistry {
    struct EvidenceRecord {
        address buyer;
        address vendor;
        uint256 amount;
        string currency;
        bytes32 evidenceHash;
        string intentId;
        string status;
        uint256 recordedAt;
    }

    mapping(bytes32 => EvidenceRecord) public records;

    event EvidenceRecorded(
        bytes32 indexed evidenceHash,
        string intentId,
        address indexed buyer,
        address indexed vendor,
        uint256 amount,
        string currency,
        string status
    );

    function recordEvidence(
        string calldata intentId,
        address vendor,
        uint256 amount,
        string calldata currency,
        bytes32 evidenceHash,
        string calldata status
    ) external {
        require(vendor != address(0), "vendor required");
        require(evidenceHash != bytes32(0), "evidence hash required");
        require(records[evidenceHash].recordedAt == 0, "evidence already recorded");

        records[evidenceHash] = EvidenceRecord({
            buyer: msg.sender,
            vendor: vendor,
            amount: amount,
            currency: currency,
            evidenceHash: evidenceHash,
            intentId: intentId,
            status: status,
            recordedAt: block.timestamp
        });

        emit EvidenceRecorded(evidenceHash, intentId, msg.sender, vendor, amount, currency, status);
    }
}
