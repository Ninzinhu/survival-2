package com.youngninnh.logininvincibility;

public class LoginInvincibility extends JavaPlugin {

    @Override
    public void onEnable() {
        // Registra o listener para o evento de login do AuthMe
        getServer().getPluginManager().registerEvents(new LoginListener(this), this);
        getLogger().info("LoginInvincibility habilitado!");
    }

    public void giveInvincibility(Player player) {
        // Aplica o efeito de invencibilidade por 30 segundos (600 ticks)
        player.addPotionEffect(new PotionEffect(PotionEffectType.DAMAGE_RESISTANCE, 600, 4));
        player.sendMessage(ChatColor.GREEN + "Você está invencível por 30 segundos!");

        // Agenda mensagens de aviso do tempo restante
        new BukkitRunnable() {
            int timeLeft = 30;

            @Override
            public void run() {
                timeLeft--;
                
                // Envia mensagens nos momentos específicos
                if (timeLeft == 20 || timeLeft == 10 || timeLeft == 5 || 
                    timeLeft == 4 || timeLeft == 3 || timeLeft == 2 || timeLeft == 1) {
                    player.sendMessage(ChatColor.YELLOW + "Invencibilidade: " + timeLeft + " segundos restantes!");
                } else if (timeLeft == 0) {
                    player.sendMessage(ChatColor.RED + "Sua invencibilidade acabou!");
                    cancel(); // Para o timer
                }
            }
        }.runTaskTimer(this, 20L, 20L); // 20 ticks = 1 segundo
    }
}