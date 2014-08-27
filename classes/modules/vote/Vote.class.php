<?php
/* ---------------------------------------------------------------------------
 * @Project: Alto CMS
 * @Plugin Name: Voter
 * @Author: Klaus
 * @License: GNU GPL v2 & MIT
 *----------------------------------------------------------------------------
 */

class PluginVoter_ModuleVote extends Module {
	/**
	 * Дополнительная обработка топиков
	 *
	 * @return unknown
	 */
	public function Init() {
		$this->oMapper = Engine::GetMapper(__CLASS__);
	}
	public function GetUserVotes($FromWhere, $id) {
		$data = $this->oMapper->GetUserVotes($FromWhere, $id);
		return $data;
	}


}
?>