$('#failchanceform').change(processRaidForm);
processRaidForm();

function processRaidForm(){
	var type  = $('#raidtype option:selected').text();
	var size  = $('#drivesize option:selected').val();
	var count = $('#drivecount option:selected').text();
	var ure   = $('#ureaverage option:selected').val();
	var chance = calculateRaidFailureChance(type, count, size, ure);


	$("#resultspan").text(Math.round(chance * 100) + "%");
}

function calculateRaidFailureChance(type, diskCount, disksizeGB, ure){
	var successChance = 1 - Math.pow(10 , -1 * ure);
	if(type == "RAID 5 / RAID-Z1"){
		return calculateRaid5FailureChance(diskCount, disksizeGB, successChance);
	}else if(type == "RAID 6 / RAID-Z2"){
		return calculateRaid6FailureChance(diskCount, disksizeGB, successChance);
	}
	}else if(type == "RAID 7 / RAID-Z3"){
		return calculateRaid7FailureChance(diskCount, disksizeGB, successChance);
	}
}

function calculateRaid5FailureChance(diskCount, disksizeGB, successChance){
	var readSize = gigabytesToBits((diskCount - 1) * disksizeGB);
	return Math.pow(successChance, readSize);
}

function calculateRaid6FailureChance(diskCount, disksizeGB, successChance){
	var chance1 = 1 - calculateRaid5FailureChance(diskCount, disksizeGB, successChance);
	var chance2 = 1 - calculateRaid5FailureChance(diskCount - 1, disksizeGB, successChance);
	return 1 - (chance1 * chance2);
}

function calculateRaid7FailureChance(diskCount, disksizeGB, successChance){
	var chance1 = 1 - calculateRaid5FailureChance(diskCount,     disksizeGB, successChance);
	var chance2 = 1 - calculateRaid5FailureChance(diskCount - 1, disksizeGB, successChance);
	var chance3 = 1 - calculateRaid5FailureChance(diskCount - 2, disksizeGB, successChance);
	return 1 - (chance1 * chance2 * chance3);
}

function gigabytesToBits(gigs){
	return gigs * 1000 * 1000 * 1000 * 8;
}
