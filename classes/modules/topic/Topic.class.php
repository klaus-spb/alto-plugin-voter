<?php
/* ---------------------------------------------------------------------------
 * @Project: Alto CMS
 * @Plugin Name: VoterQuestion
 * @Author: Klaus
 * @License: GNU GPL v2 & MIT
 *----------------------------------------------------------------------------
 */
 
class PluginVoter_ModuleTopic extends PluginVoter_Inherits_ModuleTopic {
	
	/** @var PluginVoter_ModuleTopic_MapperTopic */
    protected $oMapper;
	
	/**
	 * Дополнительная обработка топиков
	 *
	 * @return unknown
	 */
	
	public function GetUserVotesQuestion($FromWhere, $id) {
		$data = $this->oMapper->GetUserVotesQuestion($FromWhere, $id);
		return $data;
	}


}
?>