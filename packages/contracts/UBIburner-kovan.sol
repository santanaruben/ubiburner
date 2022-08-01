/**
 *Submitted for verification at Etherscan.io on 2021-09-25
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

/* Interfaces */

/**
 * @title UniswapV2Router Interface
 * @dev See https://uniswap.org/docs/v2/smart-contracts/router02/#swapexactethfortokens. This will allow us to import swapExactETHForTokens and swapExactTokensForTokens functions into our contract, also the getAmountsOut function to calculate the token amount we will swap
 */
interface IUniswapV2Router {
    function swapExactETHForTokens(
        uint256 amountOutMin, //minimum amount of output token that must be received
        address[] calldata path, //the different hops between tokens to be made by the exchange
        address to, //recipient
        uint256 deadline //unix timestamp after which the transaction will revert
    )
        external
        payable
        returns (
            uint256[] memory amounts //amounts of tokens output received
        );

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) 
        external
        returns (
            uint[] memory amounts
        );

    function getAmountsOut(
        uint256 amountIn, //amount of input token
        address[] memory path //the different hops between tokens to be made by the exchange
    )
        external
        view
        returns (
            uint256[] memory amounts //amounts of tokens output calculated to be received
        );
}

/**
 * @title IERC20 Interface
 * @dev balanceOf: This will allow us to see the token balances of our contract
 * @dev approve: Allow the uniswap contract to spend the tokens in this contract 
 */
interface IERC20 {
    function balanceOf(address _owner) external view returns (uint256);
    function approve(address _spender, uint _amount) external returns (bool);
}

contract UBIburner {

    /* Events */

    event BurnerAdded(address burner);
    event BurnerRemoved(address burner);
    event Received(address indexed from, uint256 amount);
    event BurnUBIWithETHRequested(address indexed requester, uint256 UBIAmount);
    event BurnUBIWithTokenRequested(address indexed requester, address indexed token, uint256 UBIAmount);
    event TokenApproved(address token);
    event BurnedWithETH(address indexed requester, address indexed burner, uint256 amount, uint256 burned);
    event BurnedWithToken(address indexed requester, address indexed burner, address indexed token, uint256 amount, uint256 burned);

    /* Constants */

    /// @dev address of the uniswap v2 router
    address private constant UNISWAP_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    /// @dev address of WETH token. In Uniswap v2 there are no more direct ETH pairs, all ETH must be converted to WETH first.
    address private constant WETH = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;

    /// @dev address of UBI token.
    address private constant UBI = 0xDdAdE19B13833d1bF52c1fe1352d41A8DD9fE8C9;

    /* Storage */

    /// @dev An array of token addresses. Any swap needs to have a starting and end path, path.length must be >= 2. Pools for each consecutive pair of addresses must exist and have liquidity.
    address[] path = [WETH, UBI];

    /// @dev Parameter stored by the burner request of how much the minimum amount of UBIs burned should be.
    uint256 public currentAmountOutMin;

    /// @dev Parameter stored by the burner request of how much the minimum amount of UBIs burned should be, according to the token contract balance.
    mapping(address => uint256) public currentAmountOutMinToken;

    /// @dev Burn requester. Variable stored because the burner cannot be the requester.
    address public currentBurnRequester;

    /// @dev Indicates if the address belongs to a burner. isBurner[address].
    mapping(address => bool) public isBurner;

    /// @dev Indicates whether or not there is a request to add a new burner. requestBurnerAddMap[requesterAddress][burnerAddressToAdd].
    mapping(address => mapping(address => bool)) public requestBurnerAddMap;

    /// @dev Indicates whether or not there is a request to remove a burner. requestBurnerRemovalMap[requesterAddress][burnerAddressToRemove].
    mapping(address => mapping(address => bool)) public requestBurnerRemovalMap;

    /* Modifiers */

    modifier onlyBurner() {
        require(isBurner[msg.sender], "Not burner");
        _;
    }

    /* Constructor */

    /// @dev Burners will be created in the constructor
    constructor(address[] memory _burners) {
        addBurner(msg.sender); //_burner1
        for (uint256 i = 0; i < _burners.length; i++) {
            addBurner(_burners[i]);
        }
    }

    /* External and Public */

    // ************************ //
    // *       Requests       * //
    // ************************ //
    
    /** @dev Requests the creation of a new burner.
     *  @param _burnerToAdd Address of the burner requested to be added.
     */
    function requestBurnerAdd(address _burnerToAdd) external onlyBurner {
        requestBurnerAddMap[msg.sender][_burnerToAdd] = true;
    }

    /** @dev Acceptance of the new burner. Only a burner other than the requester can accept the request.
     *  @param _requester Requester address.
     *  @param _burnerToAdd Address of the burner to be accepted.
     */
    function AddBurnerAccepted(address _requester, address _burnerToAdd)
        external
        onlyBurner
    {
        require(
            !requestBurnerAddMap[msg.sender][_burnerToAdd] &&
                requestBurnerAddMap[_requester][_burnerToAdd]
        );
        requestBurnerAddMap[_requester][_burnerToAdd] = false;
        addBurner(_burnerToAdd);
    }

    /** @dev Requests the removal of a burner.
     *  @param _burnerToRemove Address of the burner requested to be removed.
     */
    function requestBurnerRemoval(address _burnerToRemove) external onlyBurner {
        requestBurnerRemovalMap[msg.sender][_burnerToRemove] = true;
    }

    /** @dev Acceptance of the burner to be removed. Only a burner other than the requester can accept the request.
     *  @param _requester Requester address.
     *  @param _burnerToRemove Address of the burner to be removed.
     */
    function deleteBurnerAccepted(address _requester, address _burnerToRemove)
        external
        onlyBurner
    {
        require(
            !requestBurnerRemovalMap[msg.sender][_burnerToRemove] &&
                requestBurnerRemovalMap[_requester][_burnerToRemove]
        );
        requestBurnerRemovalMap[_requester][_burnerToRemove] = false;
        removeBurner(_burnerToRemove);
    }

    /// @dev UBI burn request. This stores the parameters to be used when another burner accepts. It can be called again to update the values.
    function requestBurnUBI() external onlyBurner {
        currentAmountOutMin = getAmountOutMin();
        currentBurnRequester = msg.sender;
        emit BurnUBIWithETHRequested(msg.sender, currentAmountOutMin);
    }

    /** @dev UBI burn request using a list of tokens. This stores the parameters to be used when another burner accepts. It can be called again to update the values.
     *  @param _tokens List of tokens selected to perform the burn.
     */
    function requestBurnUBIwithTOKENS(address[] calldata _tokens) external onlyBurner {
        currentBurnRequester = msg.sender;
        for (uint256 i = 0; i < _tokens.length; i++) {
            currentAmountOutMinToken[_tokens[i]] = getAmountOutMinTOKEN(_tokens[i]);
            emit BurnUBIWithTokenRequested(msg.sender, _tokens[i], currentAmountOutMinToken[_tokens[i]]);
        }
    }

    // ************************ //
    // *      Approve         * //
    // ************************ //

    /** @dev To exchange other tokens we need to approve each one in their respective contracts, and assign the UNISWAP_V2_ROUTER as an authorized spender on behalf of this contract.
     *  @param _tokens List of tokens for approve.
     */

    function approveTokens(address[] calldata _tokens) external onlyBurner {
        for (uint256 i = 0; i < _tokens.length; i++) {
            IERC20(_tokens[i]).approve(UNISWAP_V2_ROUTER, type(uint256).max);
            emit TokenApproved(_tokens[i]);
        }
    }

    // ************************ //
    // *      Burn            * //
    // ************************ //

    /** @dev Using the parameters stored by the requester, this function swaps the ETH contract balance for UBI and freezes on this contract.
     *  @param _deadline Unix timestamp after which the transaction will revert.
     *  @param _slippageDivisor Value to calculate the slippage tolerance. 100 = 1%, 500 = 0,2%, 1000 = 0,1%.
     */
    function burnUBI(uint256 _deadline, uint256 _slippageDivisor) external onlyBurner {
        uint256 _balanceToBurn = address(this).balance;
        uint256 _amountOutMin = currentAmountOutMin;
        require(_slippageDivisor >= 100, "Max 1% slippage tolerance");
        // Max 1% slippage tolerance
        uint256 _amountOutMinToUse = _amountOutMin - (_amountOutMin / _slippageDivisor);
        address _burnRequester = currentBurnRequester;
        require(_burnRequester != msg.sender && _burnRequester != address(0));
        currentAmountOutMin = 0;
        currentBurnRequester = address(0);
        uint256[] memory amounts = IUniswapV2Router(UNISWAP_V2_ROUTER).swapExactETHForTokens{
            value: _balanceToBurn
        }(_amountOutMinToUse, path, address(this), _deadline);
        emit BurnedWithETH(_burnRequester, msg.sender, _balanceToBurn, amounts[1]);
    }

    /** @dev Using the parameters stored by the requester, this function swaps tokens from the contract balance for UBI and freezes on this contract.
     *  @param _tokens List of entry tokens, used to swap for UBI.
     *  @param _deadline Unix timestamp after which the transaction will revert.
     *  @param _slippageDivisor Value to calculate the slippage tolerance. 100 = 1%, 500 = 0,2%, 1000 = 0,1%.
     */
    function burnUBIwithTOKENS(address[] calldata _tokens, uint256 _deadline, uint256 _slippageDivisor) external onlyBurner {
        address _burnRequester = currentBurnRequester;
        require(_burnRequester != msg.sender && _burnRequester != address(0));
        currentBurnRequester = address(0);
        for (uint256 i = 0; i < _tokens.length; i++) {
            uint256 _balanceToBurn = IERC20(_tokens[i]).balanceOf(address(this));
            uint256 _amountOutMinToken = currentAmountOutMinToken[_tokens[i]];
            require(_slippageDivisor >= 100, "Max 1% slippage tolerance");
            // Max 1% slippage tolerance
            uint256 _amountOutMinToUseToken = _amountOutMinToken - (_amountOutMinToken / _slippageDivisor);
            address[] memory _path;
            if (_tokens[i] == WETH) _path = path;
            else {
                _path = new address[](3);
                _path[0] = _tokens[i];
                _path[1] = WETH;
                _path[2] = UBI;
            }
            currentAmountOutMinToken[_tokens[i]] = 0;
            uint256[] memory amounts = IUniswapV2Router(UNISWAP_V2_ROUTER).swapExactTokensForTokens(_balanceToBurn, _amountOutMinToUseToken, _path, address(this), _deadline);
            emit BurnedWithToken(_burnRequester, msg.sender, _tokens[i], _balanceToBurn, amounts[_path.length - 1]);
            
        }
    }

    /* Internal */

    /** @dev Internal function to create a burner and emit an event.
     *  @param _burner Burner to add.
     */
    function addBurner(address _burner) internal {
        isBurner[_burner] = true;
        emit BurnerAdded(_burner);
    }

    /** @dev Internal function to remove a burner and emit an event.
     *  @param _burner Burner to delete.
     */
    function removeBurner(address _burner) internal {
        isBurner[_burner] = false;
        emit BurnerRemoved(_burner);
    }

    // ************************ //
    // *       Getters        * //
    // ************************ //

    /** @dev Calculate the minimum UBI amount from swapping the ETH contract balance.
     *  @return The minimum amount of output token that must be received.
     */
    function getAmountOutMin() public view returns (uint256) {
        if (address(this).balance == 0) return 0;
        uint256[] memory amountOutMins = IUniswapV2Router(UNISWAP_V2_ROUTER)
            .getAmountsOut(address(this).balance, path);
        return amountOutMins[1];
    }

    /** @dev Calculate the minimum UBI amount from swapping a Token in the contract balance.
     *  @return The minimum amount of output token that must be received.
     */
    function getAmountOutMinTOKEN(address _token) public view returns (uint256) {
        if (IERC20(_token).balanceOf(address(this)) == 0) return 0;
        address[] memory _path;
        if (_token == WETH) _path = path;
        else {
            _path = new address[](3);
            _path[0] = _token;
            _path[1] = WETH;
            _path[2] = UBI;
        }
        uint256[] memory amountOutMins = IUniswapV2Router(UNISWAP_V2_ROUTER)
            .getAmountsOut(IERC20(_token).balanceOf(address(this)), _path);
        return amountOutMins[_path.length - 1];
    }

    /** @dev Token contract balance.
     *  @return The amount of Token balance in the contract.
     */
    function TokenBalance(address _token) external view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

    /* Fallback Function */

    /// @dev Allows the contract to receive ETH
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}