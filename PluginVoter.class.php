<?php
/* ---------------------------------------------------------------------------
 * @Project: Alto CMS
 * @Plugin Name: VoterQuestion
 * @Author: Klaus
 * @License: GNU GPL v2 & MIT
 *----------------------------------------------------------------------------
 */
 
/**
 * Запрещаем напрямую через браузер обращение к этому файлу.
 */
if (!class_exists('Plugin')) {
	die('Hacking attemp!');
}

class PluginVoter extends Plugin {


    // Объявление делегирований (нужны для того, чтобы назначить свои экшны и шаблоны)
	public $aDelegates = array(
            
    );

	// Объявление переопределений (модули, мапперы и сущности)
	protected $aInherits
        = array(
            'action' => array(
				'ActionAjax'
			),
			'module' => array(
                'ModuleTopic',
            ),
            'mapper' => array(
                'ModuleTopic_MapperTopic',
            ),
        );

	// Активация плагина
	public function Activate() { 
		return true;
	}
    
	// Деактивация плагина
	public function Deactivate(){        
		return true;	 
    }


	// Инициализация плагина
	public function Init() {
        $this->Viewer_AppendScript(Plugin::GetTemplateDir(__CLASS__).'assets/js/voter.js');
		$this->Viewer_AppendStyle(Plugin::GetTemplateDir(__CLASS__).'assets/css/voter.css');
	}

   
}
?>